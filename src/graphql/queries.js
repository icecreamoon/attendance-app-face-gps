/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPunchLog = /* GraphQL */ `
  query GetPunchLog($id: ID!) {
    getPunchLog(id: $id) {
      id
      userId
      timestamp
      location
      photoUrl
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listPunchLogs = /* GraphQL */ `
  query ListPunchLogs(
    $filter: ModelPunchLogFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPunchLogs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userId
        timestamp
        location
        photoUrl
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
