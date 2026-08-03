import { File, Paths } from 'expo-file-system';
import { StorageAccessFramework } from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import {
  deserializeBackup,
  getBackupFileName,
  serializeBackup,
} from './backupFormat';
import {
  clearBackupDirectoryUri,
  exportAnswersBackup,
  getBackupDirectoryUri,
  importAnswersBackup,
  setBackupDirectoryUri,
} from './database';

export type ImportResult = 'imported' | 'canceled' | 'invalid';

// Android can't write to a public folder (e.g. Downloads) without the user
// picking it once via the Storage Access Framework; the granted permission
// is then persisted by the OS, so every later backup is saved there silently
// with no dialog at all. iOS/web have no such mechanism, so they fall back
// to the share sheet.
async function writeToSafDirectory(
  directoryUri: string,
  fileName: string,
  content: string,
): Promise<string> {
  const baseName = fileName.replace(/\.json$/, '');
  const fileUri = await StorageAccessFramework.createFileAsync(
    directoryUri,
    baseName,
    'application/json',
  );
  await StorageAccessFramework.writeAsStringAsync(fileUri, content);
  return fileUri;
}

async function exportOnAndroid(
  fileName: string,
  content: string,
): Promise<string | null> {
  const savedDirectoryUri = await getBackupDirectoryUri();
  if (savedDirectoryUri) {
    try {
      return await writeToSafDirectory(savedDirectoryUri, fileName, content);
    } catch (error) {
      // The saved folder may have been deleted/revoked; forget it and fall
      // through to asking the user to pick a folder again.
      console.error('Failed to write backup to saved folder', error);
      await clearBackupDirectoryUri();
    }
  }

  const permissions =
    await StorageAccessFramework.requestDirectoryPermissionsAsync(
      StorageAccessFramework.getUriForDirectoryInRoot('Download'),
    );
  if (!permissions.granted) {
    return null;
  }

  await setBackupDirectoryUri(permissions.directoryUri);
  return writeToSafDirectory(permissions.directoryUri, fileName, content);
}

export async function exportAnswersToFile(): Promise<string | null> {
  const backup = await exportAnswersBackup();
  const content = serializeBackup(backup);
  const fileName = getBackupFileName();

  if (Platform.OS === 'android') {
    return exportOnAndroid(fileName, content);
  }

  const file = new File(Paths.cache, fileName);
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
