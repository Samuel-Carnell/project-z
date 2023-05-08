import { extendTheme } from "@chakra-ui/theme-utils";
import { colors } from "./colors";
import { fonts } from "./fonts";

const theme = extendTheme({
	colors,
	fonts
});

export { theme };
