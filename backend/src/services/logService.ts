export const logEvent = async (
  projectId: string,
  message: string,
  userId?: string,
) => {
  console.log(
    `[PROJECT ${projectId}] ${message}` + (userId ? ` by user ${userId}` : ''),
  );
  // bővítés folyamatban
};
