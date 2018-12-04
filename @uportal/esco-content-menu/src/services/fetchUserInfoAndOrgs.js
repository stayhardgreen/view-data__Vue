import oidc from '@uportal/open-id-connect';

export default async function(contextApiUrl, userOrgIdAttribute) {
  if (process.env.NODE_ENV === 'development') {
    const userInfoRequest = await fetch('userinfo.json');
    const orgsInfoRequest = await fetch('orginfo.json');

    const [userInfo, orgsInfo] = await Promise.all([
      userInfoRequest.json(),
      orgsInfoRequest.json(),
    ]);
    return {
      user: userInfo,
      organizations: Object.values(orgsInfo),
    };
  } else {
    try {
      const {encoded, decoded} = await oidc({
        userInfoApiUrl: contextApiUrl + process.env.VUE_APP_USER_INFO_URI,
      });
      if (decoded && decoded[userOrgIdAttribute]?.length > 0) {
        const options = {
          method: 'GET',
          credentials: 'same-origin',
          headers: {
            'Authorization': 'Bearer ' + encoded,
            'Content-Type': 'application/json',
          },
        };
        const response = await fetch(
            process.env.VUE_APP_PORTAL_BASE_URL +
            process.env.VUE_APP_ORG_INFO_URI +
            '?ids=' +
            decoded[userOrgIdAttribute],
            options
        );
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const data = await response.json();

        return {
          user: decoded,
          organizations: Object.values(data),
        };
      }
      // do nothing expect returning an empty value
      return {
        user: decoded,
        organizations: [],
      };
    } catch (err) {
      // eslint-disable-next-line
      console.error(err);
      return {
        user: {},
        organizations: [],
      };
    }
  }
}
