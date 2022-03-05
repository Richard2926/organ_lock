import {
  Box,
  Button,
  Image,
  Stack,
  Text,
  Flex,
  Spacer,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Center,
  ModalCloseButton,
  ModalBody,
  VStack,
  Select,
  Input,
  useToast,  
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
// import waitlist_structure from "contracts/Waitlist.json";
import { WAITLIST_ADDRESS, WAITLIST_ABI } from "../blockchain_logic/waitlist";

export default function Waitlist() {
  const [isInitial, setInitial] = useState(true);
  const [isLoading, setLoading] = useState(true);
  const [isAdding, setAdding] = useState(false);

  const [isMatching, setMatching] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenMatch, onOpen: onOpenMatch, onClose: onCloseMatch } = useDisclosure();
  const { isOpen: isOpenCompleted, onOpen: onOpenCompleted, onClose: onCloseCompleted } = useDisclosure();

  const navigate = useNavigate();
  const toast = useToast();

  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");

  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [score, setScore] = useState(0);
  const [severity, setSeverity] = useState(0);
  const [organ, setOrgan] = useState(0);
  const [blood_type, setBloodType] = useState(0);

  const [donors, setDonors] = useState([]);
  const [patients, setPatients] = useState([]);

  const [patient, setPatient] = useState({});
  const [active_donor, setActiveDonor] = useState({});

  const authorize = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      if (accounts[0] === undefined) {
        toast({
          position: "bottom-left",
          title: "Connect Account.",
          description: "Please connect your account first!",
          status: "warning",
          duration: 6000,
          isClosable: true,
        });
        return navigate("/");
      }
      const waitlist = new web3.eth.Contract(
        WAITLIST_ABI,
        WAITLIST_ADDRESS
      );
      const result = await waitlist.methods.get_waitlist().call({
        from: accounts[0],
        //   gas: 470000,
      });
      setDonors(result[0]);
      setPatients(result[1]);
      setLoading(false);
    } catch (e) {
      console.log(e);
      toast({
        position: "bottom-left",
        title: "Unauthorized Role.",
        description:
          "Oops. Looks like you do not have the 'DOCTOR/ADMIN' role deployed on the blockchain or cancelled the transaction! Check your address and try again!",
        status: "error",
        duration: 6000,
        isClosable: true,
      });
      return navigate("/");
    }
  };

  useEffect(() => {
    async function listener() {
      let provider = window.ethereum;
      if (typeof provider !== "undefined") {
        window.ethereum.on("accountsChanged", function (accounts) {
          setInitial(true);
        });
      }
    }
    listener();
    if (isInitial) {
      authorize();
      setInitial(false);
    }
  });

  const find_organ = (num) => {
    if (num == 0) {
      return "Kidney";
    } else if (num == 1) {
      return "Liver";
    } else if (num == 2) {
      return "Lung";
    } else if (num == 3) {
      return "Pancrea";
    } else {
      return "Intestine";
    }
  };

  const find_blood = (_blood_type) => {
    if (_blood_type == 0) {
      return "A";
    } else if (_blood_type == 1) {
      return "B";
    } else if (_blood_type == 2) {
      return "AB";
    } else if (_blood_type == 3) {
      return "O";
    }
  };

  const find_donor = (patient) => {
    for (const donor of donors) {
        if (donor.recipient_id == patient.id){
            return donor;
        }
    }
  }

  const has_match = (organ_t, blood_t) => {
      for (const donor of donors) {
          if (donor.blood_type == blood_t && donor.organ == organ_t && donor.recipient_id == "-1"){
              return true
          }
      }
      return false;
  }

  const can_transplant = (donor) => {
    return (donor.blood_type == patient.blood_type && donor.organ == patient.organ && donor.recipient_id == "-1");
  }

  const match = async(donor) => {
    setMatching(true);
    setActiveDonor(donor);
    try {
        const accounts = await web3.eth.getAccounts();
        const waitlist = new web3.eth.Contract(
          WAITLIST_ABI,
          WAITLIST_ADDRESS
        );
        await waitlist.methods
          .match_donor(patient.id, donor.id)
          .send({
            from: accounts[0],
          });
        toast({
          position: "bottom-left",
          title: "Matching Success",
          description: "Patient was succesfully matched",
          status: "success",
          duration: 6000,
          isClosable: true,
        });
        onCloseMatch();
        setInitial(true);
      } catch (e) {
        console.log(e);
        toast({
          position: "bottom-left",
          title: "Oops",
          description: "Did not match patient to donor",
          status: "error",
          duration: 6000,
          isClosable: true,
        });
      }
    setMatching(false);
  }

  const add_to_waitlist = async () => {
    setAdding(true);
    try {
      const accounts = await web3.eth.getAccounts();
      const waitlist = new web3.eth.Contract(
        WAITLIST_ABI,
        WAITLIST_ADDRESS
      );
      await waitlist.methods
        .queue_recipient(name, severity, score, age, organ, blood_type)
        .send({
          from: accounts[0],
        });
      toast({
        position: "bottom-left",
        title: "Registration Success",
        description: "Patient was succesfully added",
        status: "success",
        duration: 6000,
        isClosable: true,
      });
      onClose();
      setInitial(true);
    } catch (e) {
      console.log(e);
      toast({
        position: "bottom-left",
        title: "Oops",
        description: "Did not add patient to waitlist",
        status: "error",
        duration: 6000,
        isClosable: true,
      });
    }
    setAdding(false);
  };

  console.log(donors);

  return isLoading || isInitial ? (
    <Box
      bgImage="url(/bg_dog.jpg)"
      bgPosition="center"
      bgRepeat="no-repeat"
      minH="100vh"
      bgSize="200vh"
      bgColor={"red"}
      opacity="0.4"
    ></Box>
  ) : (
    <Box
      bgImage="url(/bg_dog_mahesh.jpg)"
      bgPosition="center"
      bgRepeat="no-repeat"
      minH="100vh"
      bgSize="200vh"
      bgColor={"red"}
    >
      <Flex>
        <Image src={"/logo.png"} height="15vh" onClick={() => navigate("/")}/>
        <Spacer />
      </Flex>
      <Center>
        <VStack w="80%">
          <Center w="full" mt="5vh">
            <Button
              w="90%"
              height={"8vh"}
              bg="red.200"
              _hover={{ bg: "red.300" }}
              onClick={onOpen}
            >
              <Text fontWeight={"light"}>Add Patient To Waitlist</Text>
            </Button>
          </Center>
          <Center w="full" mt="2vh" pb="2vh">
            <Button
              w="90%"
              height={"8vh"}
              bg="blue.200"
              _hover={{ bg: "blue.300" }}
              onClick={onOpenCompleted}
            >
              <Text fontWeight={"light"}>View Matched Patients</Text>
            </Button>
          </Center>
          <Table
            variant="striped"
            colorScheme="teal"
            bg="white"
            borderRadius={"5"}
            w="90%"
          >
            <TableCaption color={"white"}>Current Waiting List</TableCaption>
            <Thead>
              <Tr>
                <Th>Patient Name</Th>
                <Th isNumeric>Age</Th>
                <Th isNumeric>Score</Th>
                <Th isNumeric>Severity Level</Th>
                <Th>Organ Type</Th>
                <Th>Blood Type</Th>
                <Th>Matches</Th>
              </Tr>
            </Thead>
            <Tbody>
              {patients.map(
                (patient) =>
                  patient.donor_id === "-1" && (
                    <Tr key={patient.id}>
                      <Td>{patient.name}</Td>
                      <Td isNumeric>{patient.age}</Td>
                      <Td isNumeric>{patient.score}</Td>
                      <Td isNumeric>{patient.severity}</Td>
                      <Td>{find_organ(patient.organ)}</Td>
                      <Td>{find_blood(patient.blood_type)}</Td>
                      <Td>
                        <Button
                          _hover={{ bg: "red.300" }}
                          bg="red.200"
                          isDisabled={
                            !has_match(patient.organ, patient.blood_type)
                          }
                          onClick={() => {
                            setPatient(patient);
                            onOpenMatch();
                          }}
                        >
                          <Text fontSize={"sm"} fontWeight="light">
                            {" "}
                            {has_match(patient.organ, patient.blood_type)
                              ? "View"
                              : "None"}
                          </Text>
                        </Button>
                      </Td>
                    </Tr>
                  )
              )}
            </Tbody>
          </Table>
        </VStack>
      </Center>
      <Modal
        onClose={() => {
          setName("");
          setAge(0);
          setScore(0);
          setOrgan(0);
          setBloodType(0);
          onClose();
        }}
        isOpen={isOpen}
        isCentered
        preserveScrollBarGap={true}
        scrollBehavior="inside"
        size="md"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Center>
              <Text fontWeight={"light"} variant="large">
                Add Patient To Waitlist
              </Text>
            </Center>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack w="full" pb="4">
              <Input
                placeholder="Patient Name"
                onChange={(e) => setName(e.target.value)}
              />
              <Flex pt="2" w="full">
                <Input
                  type="tel"
                  placeholder="Patient Age"
                  onChange={(e) => setAge(e.target.value)}
                  mr="2"
                />
                <Input
                  type="tel"
                  placeholder="Patient Score"
                  onChange={(e) => setScore(e.target.value)}
                  ml="2"
                />
              </Flex>
              <Flex w="full" pt="3">
                <Text>Severity Level:</Text>
                <Spacer />
              </Flex>
              <Select
                onChange={(e) => setSeverity(e.target.value)}
                defaultValue={severity}
                bg="white"
              >
                <option value={1}>Level 1</option>
                <option value={2}>Level 2</option>
                <option value={3}>Level 3</option>
                <option value={4}>Level 4</option>
                <option value={5}>Level 5 (Max)</option>
              </Select>
              <Flex w="full" pt="3">
                <Text>Organ Type:</Text>
                <Spacer />
              </Flex>
              <Select
                onChange={(e) => setOrgan(e.target.value)}
                defaultValue={organ}
                bg="white"
              >
                <option value={0}>Kidney</option>
                <option value={1}>Liver</option>
                <option value={2}>Lung</option>
                <option value={3}>Pancrea</option>
                <option value={4}>Intestine</option>
              </Select>

              <Flex w="full" pt="3">
                <Text>Blood Type:</Text>
                <Spacer />
              </Flex>

              <Select
                onChange={(e) => setBloodType(e.target.value)}
                defaultValue={blood_type}
                bg="white"
              >
                <option value={0}>A</option>
                <option value={1}>B</option>
                <option value={2}>AB</option>
                <option value={3}>O</option>
              </Select>

              <Flex w="full" pt="3">
                <Button
                  w="full"
                  bg="red.200"
                  _hover={{ bg: "red.300" }}
                  onClick={add_to_waitlist}
                  isLoading={isAdding}
                  isDisabled={name == "" || age < 1 || score < 1}
                >
                  <Text fontWeight={"light"}>Add Patient</Text>
                </Button>
              </Flex>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        onClose={onCloseMatch}
        isOpen={isOpenMatch}
        isCentered
        preserveScrollBarGap={true}
        scrollBehavior="inside"
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Center>
              <Text fontWeight={"light"} variant="large">
                Potential Matches for {patient.name}
              </Text>
            </Center>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Table
              variant="striped"
              colorScheme="teal"
              bg="gray.100"
              borderRadius={"5"}
              w="90%"
            >
              <TableCaption color={"black"}>End of Matches</TableCaption>
              <Thead>
                <Tr>
                  <Th>Donor Name</Th>
                  <Th isNumeric>Age</Th>
                  <Th>Organ Type</Th>
                  <Th>Blood Type</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {donors.map(
                  (donor) =>
                    can_transplant(donor) && (
                      <Tr key={donor.id}>
                        <Td>{donor.name}</Td>
                        <Td isNumeric>{donor.age}</Td>
                        <Td>{find_organ(donor.organ)}</Td>
                        <Td>{find_blood(donor.blood_type)}</Td>
                        <Td>
                          <Button
                            bg="red.200"
                            onClick={() => {
                              match(donor);
                            }}
                            isLoading={
                              isMatching && active_donor.id === donor.id
                            }
                          >
                            <Text fontSize={"sm"} fontWeight="light">
                              Match
                            </Text>
                          </Button>
                        </Td>
                      </Tr>
                    )
                )}
              </Tbody>
            </Table>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        onClose={onCloseCompleted}
        isOpen={isOpenCompleted}
        isCentered
        preserveScrollBarGap={true}
        scrollBehavior="inside"
        size="2xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Center>
              <Text fontWeight={"light"} variant="large">
                Matched Patients
              </Text>
            </Center>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Table
              variant="striped"
              colorScheme="teal"
              borderRadius={"5"}
              w="90%"
              bg="gray.100"
            >
              <TableCaption color={"black"}>
                End of completed transactions
              </TableCaption>
              <Thead>
                <Tr>
                  <Th>Patient Name</Th>
                  <Th isNumeric>Age</Th>
                  <Th>Donor Name</Th>
                  <Th isNumeric>Donor Age</Th>
                  <Th>Organ Type</Th>
                  <Th>Blood Type</Th>
                </Tr>
              </Thead>
              <Tbody>
                {patients.map(
                  (patient) =>
                    patient.donor_id !== "-1" && (
                      <Tr key={patient.id}>
                        <Td>{patient.name}</Td>
                        <Td isNumeric>{patient.age}</Td>
                        <Td>{find_donor(patient).name}</Td>
                        <Td isNumeric>{find_donor(patient).age}</Td>
                        <Td>{find_organ(patient.organ)}</Td>
                        <Td>{find_blood(patient.blood_type)}</Td>
                      </Tr>
                    )
                )}
              </Tbody>
            </Table>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
