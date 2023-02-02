import client from '../../client';

export default {
  Mutation: {
    editProfile: (
      _,
      { firstName, lastName, username, email, password }
    ) => {
      // client.user.findUnique({ where: {} });
      console.log('editProfile');
      return {
        ok: true,
      };
    },
  },
};
