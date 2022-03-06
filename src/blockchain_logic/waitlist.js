export const WAITLIST_ADDRESS = "0xCe65990401910D9584B2eFDC470C936f83BB425a";

export const WAITLIST_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "doctor",
        type: "address",
      },
      {
        internalType: "address",
        name: "donor",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "patient_id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "patient_name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "patient_age",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "patient_severity",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "patient_score",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "organ",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "blood_type",
        type: "string",
      },
    ],
    name: "AddedToWaitlist",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "donor_id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "donor_name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "age",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "organ",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "blood_type",
        type: "string",
      },
    ],
    name: "DonorRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "recipient_id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "recipient_name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "donor_id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "donor_name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    name: "MatchedToDonor",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "DOCTOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "DONOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "doctor",
        type: "address",
      },
    ],
    name: "grant_doctor_role",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "donor",
        type: "address",
      },
    ],
    name: "grant_donor_role",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "get_waitlist",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "int256",
            name: "recipient_id",
            type: "int256",
          },
          {
            internalType: "uint256",
            name: "age",
            type: "uint256",
          },
          {
            internalType: "enum Waitlist.Organ",
            name: "organ",
            type: "uint8",
          },
          {
            internalType: "enum Waitlist.BloodType",
            name: "blood_type",
            type: "uint8",
          },
        ],
        internalType: "struct Waitlist.Donor[]",
        name: "",
        type: "tuple[]",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "int256",
            name: "donor_id",
            type: "int256",
          },
          {
            internalType: "uint256",
            name: "severity",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "score",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "age",
            type: "uint256",
          },
          {
            internalType: "enum Waitlist.Organ",
            name: "organ",
            type: "uint8",
          },
          {
            internalType: "enum Waitlist.BloodType",
            name: "blood_type",
            type: "uint8",
          },
        ],
        internalType: "struct Waitlist.Recipient[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_severity",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_score",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_age",
        type: "uint256",
      },
      {
        internalType: "enum Waitlist.Organ",
        name: "_organ",
        type: "uint8",
      },
      {
        internalType: "enum Waitlist.BloodType",
        name: "_blood_type",
        type: "uint8",
      },
    ],
    name: "queue_recipient",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_recipient_id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_donor_id",
        type: "uint256",
      },
    ],
    name: "match_donor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_age",
        type: "uint256",
      },
      {
        internalType: "enum Waitlist.Organ",
        name: "_organ",
        type: "uint8",
      },
      {
        internalType: "enum Waitlist.BloodType",
        name: "_blood_type",
        type: "uint8",
      },
    ],
    name: "register_donor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
