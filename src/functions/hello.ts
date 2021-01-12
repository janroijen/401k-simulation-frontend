// modern JS style - encouraged
export async function handler(
  event: any = {},
  context: any = {}
): Promise<any> {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello world ${Math.floor(Math.random() * 10)}`,
    }),
  };
}
