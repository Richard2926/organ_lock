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
    useToast
  } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import waitlist_structure from "contracts/Waitlist.json";
import { WAITLIST_ADDRESS, WAITLIST_ABI } from "../blockchain_logic/waitlist";

export default function Waitlist() {
  const [isInitial, setInitial] = useState(true);
  const [isLoading, setLoading] = useState(true);
  const [isAdding, setAdding] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

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
        waitlist_structure.abi,
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


  const add_to_waitlist = async () => {
    setAdding(true);
    try {
        const accounts = await web3.eth.getAccounts();
      const waitlist = new web3.eth.Contract(
        waitlist_structure.abi,
        WAITLIST_ADDRESS
      );
      await waitlist.methods
        .queue_recipient(name, age, severity, score, organ, blood_type)
        .send({
          from: accounts[0],
        });
      toast({
        position: "bottom-left",
        title: "Registration Success",
        description:
          "Patient was succesfully added",
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
        description:
          "Did not add patient to waitlist",
        status: "error",
        duration: 6000,
        isClosable: true,
      });
    }
    setAdding(false);
  }

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
      bgImage="url(/bg_dog.jpg)"
      bgPosition="center"
      bgRepeat="no-repeat"
      minH="100vh"
      bgSize="200vh"
      bgColor={"red"}
      //   opacity="0.4"
    >
      <Center>
        <VStack w="80%">
          <Center w="full" mt="5vh">
            <Button
              w="60%"
              height={"8vh"}
              bg="red.200"
              _hover={{ bg: "red.300" }}
              onClick={onOpen}
            >
              <Text fontWeight={"light"}>Add Patient To Waitlist</Text>
            </Button>
          </Center>
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
    </Box>
  );
}