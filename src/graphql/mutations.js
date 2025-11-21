/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const updatePunchLog = /* GraphQL */ `
  mutation UpdatePunchLog(
    $input: UpdatePunchLogInput!
    $condition: ModelPunchLogConditionInput
  ) {
    updatePunchLog(input: $input, condition: $condition) {
      id
      userId
      timestamp
      method
      latitude
      longitude
      address
      photoUrl
      location
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deletePunchLog = /* GraphQL */ `
  mutation DeletePunchLog(
    $input: DeletePunchLogInput!
    $condition: ModelPunchLogConditionInput
  ) {
    deletePunchLog(input: $input, condition: $condition) {
      id
      userId
      timestamp
      method
      latitude
      longitude
      address
      photoUrl
      location
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createPunchLog = /* GraphQL */ `
  mutation CreatePunchLog(
    $input: CreatePunchLogInput!
    $condition: ModelPunchLogConditionInput
  ) {
    createPunchLog(input: $input, condition: $condition) {
      id
      userId
      timestamp
      method
      latitude
      longitude
      address
      photoUrl
      location
      createdAt
      updatedAt
      __typename
    }
  }
`;
