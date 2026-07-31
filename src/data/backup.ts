import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import {
  deserializeBackup,
  getBackupFileName,
  serializeBackup,
} from './backupFormat';
import { exportAnswersBackup, importAnswersBackup } from './database';

export type ImportResult = 'imported' | 'canceled' | 'invalid';

export async function exportAnswersToFile(): Promise<string> {
  const backup = await exportAnswersBackup();
  const content = serializeBackup(backup);

  const file = new File(Paths.cache, getBackupFileName());
  file.create({ overwrite: true });
  file.write(content);

  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(file.uri, {
      mimeType: 'application/json',
      dialogTitle: 'Save g-codes quiz backup',
    });
  }

  return file.uri;
}

export async function importAnswersFromFile(): Promise<ImportResult> {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'application/json',
    copyToCacheDirectory: true,
  });

  if (result.canceled) {
    return 'canceled';
  }

  const asset = result.assets[0];
  if (!asset) {
    return 'canceled';
  }

  const file = new File(asset.uri);
  const content = await file.text();
  const backup = deserializeBackup(content);
  if (!backup) {
    return 'invalid';
  }

  await importAnswersBackup(backup);
  return 'imported';
}
