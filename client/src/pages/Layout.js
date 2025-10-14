import React, { useContext } from 'react';
import { Link as RouterLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Image,
  Button,
  Link as ChakraLink,
  Stack,
  useColorModeValue,
  IconButton,
  Collapse,
  useDisclosure,
  useColorMode
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import AuthContext from '../context/AuthContext';
import MacroMateBRM from '../assests/MacroMateIconBRM.png'

function Layout() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const { isOpen, onToggle } = useDisclosure();
    const { colorMode, toggleColorMode } = useColorMode();
 
    const handleLogout = () => {
        logout();
        navigate('/login')
    };
    
    // const isMobile = useBreakpointValue({ base: true, md: false })


    return (
        <>
            {/* Sticky Navigation */}
            <Box
                as='nav'
                position="sticky"
                top={0}
                zIndex="sticky"
                bg={useColorModeValue('white', 'gray.900')}
                boxShadow="sm"
                px={[4, 6]}
                py={3}
            >
                <Flex align="center" justify="space-between" flexWrap="wrap">
                    {/* Logo + App Name */}
                    <Flex align="center" gap={3}>
                        <Image
                            src={MacroMateBRM}
                            alt='MacroMate Logo'
                            boxSize="40px"
                            borderRadius="md"
                        />
                        <ChakraLink
                            as={RouterLink}
                            to="/"
                            fontWeight="bold"
                            fontSize="xl"
                            color="green.600"
                            _hover={{ textDecoration: 'none', color: 'green.700' }}
                        >
                            MacroMate
                        </ChakraLink>
                    </Flex>

                    {/* Right: Desktop Nav + Mobile Toggle */}
                    <Flex align="center">
                        {/* Hamburger for mobile */}
                        <IconButton 
                            display={{ base: 'flex', md: 'none' }}
                            onClick={onToggle}
                            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                            variant="ghost"
                            aria-label="Toggle Navigation"
                            ml={2}
                        />
                        {/* Desktop Nav */}
                        <Stack
                            direction="row"
                            spacing={5}
                            display={{ base: 'none', md: 'flex' }}
                            align="center"
                            ml={8}
                        >
                            {navLinks.map((nav) => (
                                <ChakraLink
                                    key={nav.label}
                                    as={RouterLink}
                                    to={nav.href}
                                    fontWeight="medium"
                                    _hover={{ color: 'green.600' }}
                                >
                                    {nav.label}
                                </ChakraLink>
                            ))}

                            {/* Dark Mode Toggle (Desktop) */}
                            <IconButton
                                aria-label='Toggle Dark Mode'
                                icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                                onClick={toggleColorMode}
                                variant="ghost"
                                size="sm"
                                display={{ base: 'none', md: 'flex' }}
                            />

                            <Button
                                size="sm"
                                colorScheme="red"
                                onClick={handleLogout}
                                _hover={{ bg: 'red.500' }}
                            >
                                Logout
                            </Button>
                        </Stack>
                    </Flex>
                </Flex>

                {/* Mobile Navigation Menu */}
                <Collapse in={isOpen} animateOpacity>
                    <Box
                        display={{ base: 'block', md: 'none' }}
                        px={4}
                        pb={4}
                        bg={useColorModeValue('gray.50', 'gray.800')}
                        rounded="md"
                        shadow="md"
                        borderTopWidth="1px solid"
                        borderColor={useColorModeValue("gray.200", "gray.700")}
                        mt={2}
                    >
                        <Stack spacing={3} mt={4} direction="column">
                            {navLinks.map((nav) => (
                                <ChakraLink
                                key={nav.label}
                                as={RouterLink}
                                to={nav.href}
                                py={2}
                                px={3}
                                w="full"
                                fontWeight="medium"
                                _hover={{ color: 'green.600' }}
                                onClick={onToggle}
                                >
                                    {nav.label}
                                </ChakraLink>
                            ))}

                            <Button
                                leftIcon={  
                                    colorMode === 'light' ? <MoonIcon /> : <SunIcon />
                                }
                                onClick={toggleColorMode}
                                variant="outline"
                                w="full"
                            >
                                {colorMode === 'light' ? "Dark Mode" : "Light Mode"}
                            </Button>

                            <Button
                                size="sm"
                                colorScheme="red"
                                onClick={() => {
                                    handleLogout();
                                    onToggle();
                                }}
                                rounded="md"
                                _hover={{ bg: 'red.500' }}
                            >
                                Logout
                            </Button>
                        </Stack>
                    </Box>
                </Collapse>
            </Box>

            {/* Main Page Content */}
            <Box px={[4, 6]} py={8} minH="calc(100vh - 80px)" bg={useColorModeValue("gray.50", "gray.800")}>
                <Outlet />
            </Box>
        </>
    );
}

const navLinks = [
  { label: 'Dashboard', href: '/' },
  { label: 'Log Food', href: '/log-food' },
  { label: 'Saved Foods', href: '/saved-food' },
  { label: 'Nutrition Goal', href: '/goals' },
  { label: 'View Logs', href: '/history' },
];

export default Layout;