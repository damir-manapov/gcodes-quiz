import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f7ff',
  },
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#172554',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  backupRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  backupButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
  },
  backupButtonText: {
    color: '#2563eb',
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  actionButton: {
    flexGrow: 1,
    minWidth: '30%',
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statLabel: {
    flex: 1,
    fontSize: 14,
    color: '#334155',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  meta: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#cbd5e1',
    borderRadius: 999,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  cardText: {
    fontSize: 16,
    color: '#334155',
  },
  prompt: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#f8fafc',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridOptionButton: {
    flexBasis: '30%',
    flexGrow: 1,
    alignItems: 'center',
  },
  selectedOption: {
    borderColor: '#2563eb',
    backgroundColor: '#dbeafe',
  },
  correctOption: {
    borderColor: '#16a34a',
    backgroundColor: '#dcfce7',
  },
  wrongOption: {
    borderColor: '#dc2626',
    backgroundColor: '#fee2e2',
  },
  optionText: {
    color: '#0f172a',
    fontSize: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#f8fafc',
    fontSize: 16,
    color: '#0f172a',
  },
  typedResultCorrect: {
    color: '#16a34a',
    fontWeight: '700',
    fontSize: 16,
  },
  typedResultIncorrect: {
    color: '#dc2626',
    fontWeight: '700',
    fontSize: 16,
  },
  feedbackCard: {
    marginTop: 16,
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 16,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1d4ed8',
    marginBottom: 8,
  },
  feedbackText: {
    color: '#1e3a8a',
    marginBottom: 12,
    lineHeight: 20,
  },
  nextButton: {
    backgroundColor: '#2563eb',
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
