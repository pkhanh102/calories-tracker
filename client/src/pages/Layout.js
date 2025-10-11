import React, { useContext } from 'react';
import { Link as RouterLink, Outlet, useNavigate } from 'react-router-dom';
import {
    Box,
    Flex,
    Image,
    Button,
    Link as ChakraLink,
    HStack,
    useColorModeValue,
    useBreakpointValue,
    Stack,
    textDecoration
} from '@chakra-ui/react';
import AuthContext from '../context/AuthContext';
import MacroMateBRM from '../assests/MacroMateBRM.png'

function Layout() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
 
    const handleLogout = () => {
        logout();
        navigate('/login')
    };
    
    const isMobile = useBreakpointValue({ base: true, md: false })

    return (
        <>
            {/* Sticky Navigation */}
            <Box
                as='nav'
                position=""
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

                    {/* Navigation Links */}
                    <Stack
                        direction={{ base: 'column', md: 'row'}}
                        spacing={[2, 4, 6]}
                        mt={{ base: 4, md: 0 }}
                        align="center"
                    >
                        <ChakraLink
                            as={RouterLink}
                            to="/"
                            _hover={{ color: 'green.600' }}
                            fontWeight="medium"
                        >
                            Dashboard
                        </ChakraLink>
                        <ChakraLink
                            as={RouterLink}
                            to="/log-food"
                            _hover={{ color: 'green.600' }}
                            fontWeight="medium"
                        >
                            Log Food
                        </ChakraLink>
                        <ChakraLink
                            as={RouterLink}
                            to="/saved-food"
                            _hover={{ color: 'green.600' }}
                            fontWeight="medium"
                        >
                            Saved Foods
                        </ChakraLink>
                        <ChakraLink
                            as={RouterLink}
                            to="/goals"
                            _hover={{ color: 'green.600' }}
                            fontWeight="medium"
                        >
                            Nutrition Goal
                        </ChakraLink>
                        <ChakraLink
                            as={RouterLink}
                            to="/history"
                            _hover={{ color: 'green.600' }}
                            fontWeight="medium"
                        >
                            View Logs
                        </ChakraLink>
                        <Button 
                            size="sm"
                            colorScheme='red'
                            variant="solid"
                            onClick={handleLogout}
                            _hover={{ bg: 'red.500'}}
                        >
                            Logout
                        </Button>
                    </Stack>
                </Flex>
            </Box>

            {/* Main Page Content */}
            <Box px={[4, 6]} py={8} minH="calc(100vh - 80px)" bg={useColorModeValue("gray.50", "gray.800")}>
                <Outlet />
            </Box>
        </>
    );
}

export default Layout;