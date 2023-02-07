// import { createWriteStream, ReadStream } from 'fs';
import { Resolver, Resolvers } from '../../types';
import { protectResolver } from '../../users/users.utils';
import { generateHashtagObj } from '../photo.utils';

const resolverFn: Resolver = async (
  _,
  { file, caption },
  { loggedInUser, client }
) => {
  let hashtagObjs = generateHashtagObj(caption);

  let fileUrl = '';
  // if (file) {
  //   const { filename, createReadStream } = await file;

  //   fileUrl = `${
  //     loggedInUser.id
  //   }-${Date.now()}-${filename}`;

  //   const readStream: ReadStream = createReadStream();

  //   const writeStream = createWriteStream(
  //     `${process.cwd()}/uploads/${fileUrl}`
  //   );

  //   readStream.pipe(writeStream);
  // }

  return client.photo.create({
    data: {
      file: fileUrl,
      caption,
      user: {
        connect: {
          id: loggedInUser.id,
        },
      },
      ...(hashtagObjs && {
        hashtags: {
          connectOrCreate: hashtagObjs,
        },
      }),
    },
  });
};

const resolvers: Resolvers = {
  Mutation: {
    uploadPhoto: protectResolver(resolverFn),
  },
};

export default resolvers;
