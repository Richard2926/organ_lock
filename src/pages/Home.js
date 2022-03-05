import { useEffect, useState } from "react";
import Web3 from "web3";
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
import waitlist_structure from "contracts/Waitlist.json";
import { WAITLIST_ADDRESS, WAITLIST_ABI } from "../blockchain_logic/waitlist";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Home() {
  const [account, setAccount] = useState();
  const [isInitial, setInitial] = useState(true);
  const [isDonoring, setDonoring] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isRegistering, onOpen: onOpenRegister, onClose: onCloseRegister } = useDisclosure();
  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
  const toast = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [organ, setOrgan] = useState(0);
  const [blood_type, setBloodType] = useState(0);

  const register = async () => {
    setDonoring(true);
    try {
      const waitlist = new web3.eth.Contract(
        waitlist_structure.abi,
        WAITLIST_ADDRESS
      );
      await waitlist.methods
        .register_donor(name, age, organ, blood_type)
        .send({
          from: account,
        });
      toast({
        position: "bottom-left",
        title: "Registration Success",
        description:
          "Thank you for your contribution! We will make sure your donation gets to the right person",
        status: "success",
        duration: 6000,
        isClosable: true,
      });
      onCloseRegister();
    } catch (e) {
      console.log(e);
      toast({
        position: "bottom-left",
        title: "Unauthorized Role.",
        description:
          "Either you do not have the 'DONOR' role deployed on the blockchain or you cancelled the tranasction! If former, obtain the role through a Doctor or a Transplant Team!",
        status: "error",
        duration: 6000,
        isClosable: true,
      });
    }
    setDonoring(false);
  }

  const connect_wallet = async () => {
    await web3.eth.requestAccounts();
  };

  const update_inital = async () => {
    if (isInitial) {
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
      setInitial(false);
    }
  };

  useEffect(() => {
    async function listener () {
      let provider = window.ethereum;
      if (typeof provider !== 'undefined') {
        window.ethereum.on('accountsChanged', function (accounts) {
          onCloseRegister();
          onClose();
          setAccount(accounts[0]);
          if (accounts[0] !== undefined) {
            onOpen();
          }
        });
      }
    };
    update_inital();
    listener();
  });

  return (
    <Box
      bgImage="url(/bg_dog.jpg)"
      bgPosition="center"
      bgRepeat="no-repeat"
      minH="100vh"
      bgSize="200vh"
      bgColor={"red"}
    >
      <Flex>
        <Image src={"/logo.png"} height="15vh" />
        <Spacer />
        <Button
          size={"lg"}
          mr="20"
          mt="5"
          bg="red.200"
          onClick={account === undefined ? connect_wallet : onOpen}
          _hover={{ bg: "red.300" }}
          isLoading={isInitial}
          // disabled={account != undefined}
        >
          <Text fontWeight={"light"}>
            {account === undefined ? "Connect Wallet" : account}
          </Text>
        </Button>
      </Flex>
      <Modal
        onClose={onClose}
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
                What would you like to do?
              </Text>
            </Center>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack w="full" pb="4">
              <Flex w="full">
                <Text>For Doctors/Transplant Teams:</Text>
                <Spacer />
              </Flex>
              <Button w="full" bg="red.200" _hover={{ bg: "red.300" }} onClick={() => navigate("/doctor")}>
                <Text fontWeight={"light"}>View Waitlist</Text>
              </Button>

              <Flex w="full" pt="3">
                <Text>For Donors:</Text>
                <Spacer />
              </Flex>

              <Button
                w="full"
                bg="red.200"
                _hover={{ bg: "red.300" }}
                onClick={() => {
                  onClose();
                  onOpenRegister();
                }}
              >
                <Text fontWeight={"light"}>Register Now</Text>
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        onClose={() => {
          setName("");
          setAge(0);
          setOrgan(0);
          setBloodType(0);
          onCloseRegister();
        }}
        isOpen={isRegistering}
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
                Register As Donor
              </Text>
            </Center>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack w="full" pb="4">
              <Input
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
              />
              <Flex pt="2" w="full">
              <Input
                type="tel"
                placeholder="Age"
                onChange={(e) => setAge(e.target.value)}
              />              </Flex>
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
                  onClick={register}
                  isLoading={isDonoring}
                  isDisabled={(name == "" ) || age < 1}
                >
                  <Text fontWeight={"light"}>Register</Text>
                </Button>
              </Flex>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Home;