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
  import waitlist_structure from "contracts/Waitlist.json";
  import { WAITLIST_ADDRESS, WAITLIST_ABI } from "../blockchain_logic/waitlist";
  
  export default function Admin() {
    const [load, setLoad] = useState(0);
  
    const toast = useToast();
    const navigate = useNavigate();

    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
  
    const [address, setAddress] = useState("");
  
    const grant_doctor = async () => {
        setLoad(1);
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
        const result = await waitlist.methods.grant_doctor_role(address).call({
          from: accounts[0],
        });
        setLoad(0);
      } catch (e) {
        console.log(e);
        toast({
          position: "bottom-left",
          title: "Unauthorized Role.",
          description:
            "Oops. Looks like you do not have the 'WHO/ADMIN' role deployed on the blockchain or cancelled the transaction! Check your address and try again!",
          status: "error",
          duration: 6000,
          isClosable: true,
        });
        return navigate("/");
      }
    };
  
    useEffect(() => {

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
        </Flex>
        <Center>
          <VStack w="80%">
            <Center w="full" mt="25vh">
              <Input
                placeholder="Account Address"
                onChange={(e) => setAddress(e.target.value)}
                w="90%"
                bg="white"
                minH={"8vh"}
              />
            </Center>
            <Center w="full" pt="3vh">
              <Button
                w="90%"
                height={"8vh"}
                bg="red.200"
                _hover={{ bg: "red.300" }}
                onClick={grant_doctor}
              >
                <Text fontWeight={"light"}>Grant Doctor Role</Text>
              </Button>
            </Center>
            <Center w="full" mt="2vh" pb="2vh">
              <Button
                w="90%"
                height={"8vh"}
                bg="blue.200"
                _hover={{ bg: "blue.300" }}
                onClick={grant_doctor}
              >
                <Text fontWeight={"light"}>Grant Donor Role</Text>
              </Button>
            </Center>
          </VStack>
        </Center>
      </Box>
    );
  }
  