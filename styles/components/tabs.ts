import { tabsAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools' // import utility to set light and dark mode props

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tabsAnatomy.keys)

// define a custom variant
const colorfulVariant = definePartsStyle((props) => {
  const { colorScheme: c } = props // extract colorScheme from component props

  return {
    tab: {
      border: '2px solid',
      borderColor: 'transparent',
      // use colorScheme to change background color with dark and light mode options
      bg: "transparent",
      //bg: mode(`${c}.300`, `${c}.600`)(props),
      borderTopRadius: 'lg',
      borderBottom: 'none',
      color: "#444",
      fontWeight: 600,
      //borderBottom: 'none',
      _selected: {
        //bg: mode('#fff', 'gray.800')(props),
        bg: "#ddd",
        color: "#0277ba",
        //borderColor: 'inherit',
        borderBottom: 'none',
        mb: '-2px',
      },
    },
    tablist: {
      borderBottom: 'none',
      borderColor: 'inherit',
    },
    tabpanel: {
      border: '2px solid',
      borderColor: 'inherit',
      borderBottomRadius: 'lg',
      borderTopRightRadius: 'lg',
    },
  }
})

const variants = {
  colorful: colorfulVariant,
}

// export the component theme
export const tabsTheme = defineMultiStyleConfig({ variants })