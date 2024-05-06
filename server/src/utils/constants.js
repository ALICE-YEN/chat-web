// graphQLError extensions
export const extensions = {
  code: "BAD_USER_INPUT",
  http: {
    status: 400,
    // headers: new Map([
    //   ['some-header', 'it was bad'],
    //   ['another-header', 'seriously'],
    // ]),
  },
};
