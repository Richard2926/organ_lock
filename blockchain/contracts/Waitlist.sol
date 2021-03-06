// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract Waitlist is AccessControl {

  bytes32 public constant DOCTOR = keccak256("DOCTOR");
  bytes32 public constant DONOR = keccak256("DONOR");

  constructor (address doctor, address donor) public {
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _setupRole(DOCTOR, msg.sender);
    _setupRole(DONOR, msg.sender);
    _setupRole(DOCTOR, doctor);
    _setupRole(DONOR, donor);
  }


  uint private recipient_counter = 0;
  uint private donor_counter = 0;

  enum Organ {
      kidney,
      liver,
      lung,
      pancreas,
      intestine
   }

   enum BloodType {
      A,
      B,
      AB,
      O
   }

  struct Recipient {
    uint id;
    string name;
    int256 donor_id;
    uint severity;
    uint score;
    uint age;
    Organ organ;
    BloodType blood_type;
  }

  struct Donor {
    uint id;
    string name;
    int256 recipient_id;
    uint age;
    Organ organ;
    BloodType blood_type;
  }

  mapping(uint => Recipient) private waitlist;
  mapping(uint => Donor) private donor_list;

  event AddedToWaitlist(
    uint patient_id,
    string patient_name,
    uint patient_age,
    uint patient_severity,
    uint patient_score,
    string organ,
    string blood_type
  );

  event MatchedToDonor(
    uint recipient_id,
    string recipient_name,
    uint donor_id,
    string donor_name,
    bool success
  );

  event DonorRegistered(
    uint donor_id,
    string donor_name,
    uint age,
    string organ,
    string blood_type
  );

  function grant_doctor_role(address doctor) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _setupRole(DOCTOR, doctor);
  }

  function grant_donor_role(address donor) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _setupRole(DONOR, donor);
  }

  function get_waitlist() public onlyRole(DOCTOR) returns (Donor[] memory, Recipient[] memory) {
    Donor[] memory donors = new Donor[](donor_counter);
    Recipient[] memory patients = new Recipient[](recipient_counter);

    for (uint i = 0; i < donor_counter; i++) {
      Donor storage donor = donor_list[i];
      donors[i] = donor;
    }

    for (uint j = 0; j < recipient_counter; j++) {
      Recipient storage patient = waitlist[j];
      patients[j] = patient;
    }

    return (donors, patients);
  } 

  function queue_recipient(string memory _name, uint _severity, uint _score, uint _age, Organ _organ, BloodType _blood_type) public onlyRole(DOCTOR) {
    waitlist[recipient_counter] = Recipient(recipient_counter, _name, -1,  _severity, _score, _age, _organ, _blood_type);
    
    string memory _organ_name = "";
    string memory _blood = "";

    if (_organ == Organ.kidney ) {
      _organ_name = "kidney";
    } else if (_organ == Organ.liver ) {
      _organ_name = "liver";
    } else if (_organ == Organ.lung ) {
      _organ_name = "lung";
    } else if (_organ == Organ.pancreas ) {
      _organ_name = "pancreas";
    } else if (_organ == Organ.intestine ) {
      _organ_name = "intestine";
    } 

    if (_blood_type == BloodType.A ) {
      _blood = "A";
    } else if (_blood_type == BloodType.B ) {
      _blood = "B";
    } else if (_blood_type == BloodType.AB ) {
      _blood = "AB";
    } else if (_blood_type == BloodType.O ) {
      _blood = "O";
    }

    emit AddedToWaitlist(recipient_counter, _name, _age, _severity, _score, _organ_name, _blood);
    recipient_counter++;
  }

  function match_donor(uint _recipient_id, uint _donor_id) public onlyRole(DOCTOR) {
    Recipient memory _recipient = waitlist[_recipient_id];
    Donor memory _donor = donor_list[_donor_id];

    if (_recipient.donor_id == -1 && _donor.recipient_id == -1) {
      _recipient.donor_id = int256(_donor_id);
      _donor.recipient_id = int256(_recipient_id);

      waitlist[_recipient_id] = _recipient;
      donor_list[_donor_id] = _donor;

      emit MatchedToDonor(_recipient_id, _recipient.name, _donor_id, _donor.name, true);
    } else {
      emit MatchedToDonor(_recipient_id, _recipient.name, _donor_id, _donor.name, false);
    }
  }

  function register_donor(string memory _name, uint _age, Organ _organ, BloodType _blood_type) public onlyRole(DONOR) {
    donor_list[donor_counter] = Donor(donor_counter, _name, -1, _age, _organ, _blood_type);
    donor_counter++;

    string memory _organ_name = "";
    string memory _blood = "";

    if (_organ == Organ.kidney ) {
      _organ_name = "kidney";
    } else if (_organ == Organ.liver ) {
      _organ_name = "liver";
    } else if (_organ == Organ.lung ) {
      _organ_name = "lung";
    } else if (_organ == Organ.pancreas ) {
      _organ_name = "pancreas";
    } else if (_organ == Organ.intestine ) {
      _organ_name = "intestine";
    } 

    if (_blood_type == BloodType.A ) {
      _blood = "A";
    } else if (_blood_type == BloodType.B ) {
      _blood = "B";
    } else if (_blood_type == BloodType.AB ) {
      _blood = "AB";
    } else if (_blood_type == BloodType.O ) {
      _blood = "O";
    }

    emit DonorRegistered(donor_counter, _name, _age, _organ_name, _blood);
  }
}