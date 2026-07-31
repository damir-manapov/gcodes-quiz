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
  // Use expo-file-system's own picker (not expo-document-picker): files it
  // returns are granted read permission through its permission tracking,
  // whereas files copied by expo-document-picker are not and fail to read
  // with a "Missing 'READ' permission" error.
  const picked = await File.pickFileAsync({ mimeTypes: '*/*' });
  if (picked.canceled) {
    return 'canceled';
  }

  const file = picked.result;
  let content: string;
  try {
    content = await file.text();
  } catch (error) {
    console.error('Failed to read backup file', file.uri, error);
    throw error;
  }

  const backup = deserializeBackup(content);
  if (!backup) {
    return 'invalid';
  }

  await importAnswersBackup(backup);
  return 'imported';
}
