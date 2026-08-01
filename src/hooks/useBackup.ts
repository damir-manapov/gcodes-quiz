import { useState } from 'react';
import { Alert } from 'react-native';
import { exportAnswersToFile, importAnswersFromFile } from '../data/backup';
import type { UiStrings } from '../i18n';
import { logError } from '../logger';

export function useBackup(t: UiStrings) {
  const [isBackupBusy, setIsBackupBusy] = useState(false);

  const handleBackup = async () => {
    if (isBackupBusy) {
      return;
    }
    setIsBackupBusy(true);
    try {
      await exportAnswersToFile();
      Alert.alert(t.backupReadyTitle, t.backupReadyMessage);
    } catch (error) {
      logError('Backup failed', error);
      Alert.alert(t.backupFailedTitle, t.backupFailedMessage);
    } finally {
      setIsBackupBusy(false);
    }
  };

  const handleRestore = async () => {
    if (isBackupBusy) {
      return;
    }
    setIsBackupBusy(true);
    try {
      const result = await importAnswersFromFile();
      if (result === 'imported') {
        Alert.alert(t.restoreCompleteTitle, t.restoreCompleteMessage);
      } else if (result === 'invalid') {
        Alert.alert(t.restoreInvalidTitle, t.restoreInvalidMessage);
      }
    } catch (error) {
      logError('Restore failed', error);
      Alert.alert(t.restoreFailedTitle, t.restoreFailedMessage);
    } finally {
      setIsBackupBusy(false);
    }
  };

  return { isBackupBusy, handleBackup, handleRestore };
}
