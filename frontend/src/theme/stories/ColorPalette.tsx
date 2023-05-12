import { Box, ChakraProvider, SimpleGrid, Text } from "@chakra-ui/react";
import { colors } from "../colors";
import { theme } from "../theme";

function colorName(key: string) {
	return key.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
		return str.toUpperCase();
	});
}

function ColorPalette() {
	return (
		<ChakraProvider theme={theme}>
			{Object.entries(colors).map(([key, variants]) => {
				if (typeof variants === "string") {
					return null;
				}

				return (
					<Box mb={4}>
						<Text mb={2} fontWeight="semibold">
							{colorName(key)}
						</Text>
						<SimpleGrid key={key} spacing={1} columns={12}>
							{Object.keys(variants).map(variant => {
								return (
									<Box key={variant} flex={1} minWidth={16}>
										<Box rounded="lg" boxShadow="md" h={10} background={`${key}.${variant}`} />
										<Text textAlign="center" w="full" margin={1} fontWeight="semibold">
											{variant}
										</Text>
									</Box>
								);
							})}
						</SimpleGrid>
					</Box>
				);
			})}
		</ChakraProvider>
	);
}

export { ColorPalette };
