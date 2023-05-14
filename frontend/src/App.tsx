import { ReactNode } from "react";
import { Box, chakra, ChakraProvider, Flex, Text } from "@chakra-ui/react";
import { HiOutlineBell, HiOutlineInbox, HiOutlineSquares2X2 } from "react-icons/hi2";
import { Board } from "./components/board";
import { theme } from "./theme";

const Window = chakra("div", {
	baseStyle: {
		width: "100vw",
		height: "100vh"
	}
});

function Layout({ children }: { children?: ReactNode }) {
	return (
		<Flex direction="row" height="full">
			<Box background="slate.700">
				<Flex direction="column" gap={2} py={2} px={2.5}>
					<Box p={1.5} margin={"auto"} cursor={"pointer"}>
						<HiOutlineSquares2X2 size="2rem" color="white" width="2rem" className="react-icons" />
					</Box>
					<Box p={1.5} margin={"auto"} cursor={"pointer"}>
						<HiOutlineBell size="1.6rem" color="white" className="react-icons" />
					</Box>
					<Box p={1.5} margin={"auto"} background={"slate.600"} rounded="md" cursor={"pointer"}>
						<HiOutlineInbox size="1.6rem" color="white" className="react-icons" />
					</Box>
				</Flex>
			</Box>
			{/* <Box background="blackAlpha.200" width={200} boxShadow="md"></Box> */}
			<Flex flexDirection="column" grow={1}>
				{children}
			</Flex>
		</Flex>
	);
}

function App() {
	return (
		<ChakraProvider theme={theme}>
			<Window>
				<Layout>
					<Flex direction="column" grow={1}>
						<Box boxShadow="md" py={2} px={3}>
							<Text fontSize="2xl" fontWeight={"light"}>
								Alexander Flemming
							</Text>
						</Box>
						<Board flex={1} />
					</Flex>
				</Layout>
			</Window>
		</ChakraProvider>
	);
}

export default App;
