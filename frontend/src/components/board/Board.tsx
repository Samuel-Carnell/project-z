import {
	Avatar,
	AvatarGroup,
	Box,
	Button,
	chakra,
	Flex,
	SimpleGrid,
	StyleProps,
	Tag,
	TagLabel,
	Text
} from "@chakra-ui/react";
import {
	HiCalendar,
	HiChatBubbleLeft,
	HiChatBubbleOvalLeft,
	HiChatBubbleOvalLeftEllipsis,
	HiEllipsisHorizontal
} from "react-icons/hi2";

const HiEllipsisHorizontalIcon = chakra(HiEllipsisHorizontal);
const HiCalendarIcon = chakra(HiCalendar);
const HiChatBubbleLeftIcon = chakra(HiChatBubbleOvalLeftEllipsis);

function Board(props: StyleProps) {
	return (
		<Flex direction="column" p={3} gap={3} {...props}>
			<Box>
				<Button fontWeight={"normal"} colorScheme="blue">
					New Task
				</Button>
			</Box>
			<SimpleGrid columns={5} flex={1} spacing={8}>
				<Box rounded="lg" bg="neutral.100" py={3} px={3} maxWidth="420px" minWidth="290px">
					<Text fontWeight="semibold" fontSize="lg">
						Todo
					</Text>
					{new Array(5).fill(null).map(x => (
						<Box
							bg="white"
							rounded="lg"
							mt={3}
							shadow="sm"
							p={3}
							borderColor="blue.400"
							cursor="pointer"
							_hover={{ borderColor: "gray.300", borderWidth: 1 }}
							_active={{ borderColor: "blue.400", borderWidth: 2 }}
						>
							<Flex alignItems="center">
								<Text fontSize="sm" fontWeight="medium" flex={1}>
									Create new components
								</Text>
								<HiEllipsisHorizontalIcon fontSize="2xl" fontWeight="bold" />
							</Flex>
							<Flex columnGap={2} flexWrap="wrap">
								<Tag size="sm" mt={2} variant="outline" colorScheme="gray">
									<TagLabel>Frontend</TagLabel>
								</Tag>
								<Tag size="sm" mt={2} variant="outline" colorScheme="gray">
									<TagLabel>Must do</TagLabel>
								</Tag>
								<Tag size="sm" mt={2} variant="outline" colorScheme="gray">
									<TagLabel>Frontend</TagLabel>
								</Tag>
								<Tag size="sm" mt={2} variant="outline" colorScheme="gray">
									<TagLabel>Must do</TagLabel>
								</Tag>
							</Flex>
							<Flex alignItems="center" fontSize="lg" mt={2}>
								<Box flex={1}>
									<AvatarGroup size="xs" max={3}>
										<Avatar name="Ryan Florence" src="https://avatars.githubusercontent.com/u/39604204" />
										<Avatar name="Ryan Florence" bg="red.500" />
									</AvatarGroup>
								</Box>
								{/* <HiChatBubbleLeftIcon /> */}
								{/* <Flex alignItems="end">
									<Text fontSize="xs" mx={2}>
										12/04/22
									</Text>
									<HiCalendarIcon />
								</Flex> */}
							</Flex>
						</Box>
					))}
				</Box>
				<Box rounded="lg" bg="neutral.100" py={2} px={3}>
					<Text fontWeight="semibold" fontSize="lg">
						In Progress
					</Text>
				</Box>
				<Box rounded="lg" bg="neutral.100" py={2} px={3}>
					<Text fontWeight="semibold" fontSize="lg">
						Done
					</Text>
				</Box>
			</SimpleGrid>
		</Flex>
	);
}
export { Board };
