const COLLAB_NAMES = [
  'Emma Wilson',
  'Liam Chen',
  'Sophia Patel',
  'Noah Kim',
  'Olivia Santos',
  'Aiden Murphy',
  'Mia Tanaka',
  'Lucas Rivera',
  'Ava Johansson',
  'Ethan Okafor',
];

const nameMap = new Map<string, string>();
let nameCounter = 0;

export function getCollabName(sessionId: string): string {
  if (!nameMap.has(sessionId)) {
    nameMap.set(sessionId, COLLAB_NAMES[nameCounter % COLLAB_NAMES.length]);
    nameCounter++;
  }
  return nameMap.get(sessionId)!;
}

export function clearCollabName(sessionId: string): void {
  nameMap.delete(sessionId);
}
