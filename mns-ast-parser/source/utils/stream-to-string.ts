
export const streamToString = (stream: NodeJS.WritableStream): Promise<string> => {
    const chunks: Buffer[] = [];

    return new Promise((resolve, reject) => {
      stream
        .on('error', reject)
        .on('data', (chunk) => chunks.push(Buffer.from(chunk)))
        .on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
  }