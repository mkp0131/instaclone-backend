// import { createWriteStream, ReadStream } from 'fs';
import { uploadToS3 } from '../../shared/shared.utils';
import { Resolver, Resolvers } from '../../types';
import { protectResolver } from '../../users/users.utils';
import { generateHashtagObj } from '../photo.utils';

const resolverFn: Resolver = async (
  _,
  { file, caption },
  { loggedInUser, client }
) => {
  if (!loggedInUser || !loggedInUser.id) {
    return null;
  }

  let hashtagObjs = generateHashtagObj(caption);

  let fileUrl = '';

  if (file) {
    fileUrl = await uploadToS3(file, loggedInUser.id);
  }

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
