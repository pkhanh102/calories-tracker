import React, { useState, useEffect} from "react";
import axios from "axios";
import API_BASE from "../apiConfig";
import {
    Box,
    Heading,
    Input,
    InputGroup,
    FormControl,
    FormLabel,
    Button,
    useToast,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Container,
    Stack,
    Text,
    useColorModeValue,
    useBreakpointValue,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Flex,
    SimpleGrid,
    InputLeftElement
} from "@chakra-ui/react";
import { AddIcon, SearchIcon } from "@chakra-ui/icons";

// ✅ Reusable FoodForm component
function FoodForm({ foodData, onChange, formErrors = {} }) {
    return (
        <Stack spacing={3}>
            {["name", "base_amount", "unit", "calories", "protein", "carbs", "fats"].map((field, index) => (
                <FormControl key={index} isRequired isInvalid={formErrors?.[field]}>
                    <FormLabel textTransform="capitalize">{field.replace("_", " ")}</FormLabel>
                    <Input
                        type={field === "name" || field === "unit" ? "text" : "number"}
                        name={field}
                        value={foodData[field]}
                        onChange={onChange}
                        size="sm"
                    />
                </FormControl>
            ))}
        </Stack>
    );
}

function SavedFoodsPage() {
    const [foods, setFoods] = useState([]);
    const [filteredFoods, setFilteredFoods] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingFood, setEditingFood] = useState({});
    const [newFood, setNewFood] = useState({
        name: '',
        base_amount: '',
        unit: 'g',
        calories: '',
        protein: '',
        carbs: '',
        fats: ''
    });

    const toast = useToast();
    const textColor = useColorModeValue("gray.600", "gray.300");
    const bgCard = useColorModeValue("white", "gray.800");
    const editHighlight = useColorModeValue("green.50", "green.700");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const isMobile = useBreakpointValue({ base: true, md: false });

    const [formErrors, setFormErrors] = useState({});


    useEffect(() => {
        fetchSavedFoods();
    }, []);

    useEffect(() => {
        // Live Filtering
        if (searchQuery.trim() === "") setFilteredFoods(foods);
        else {
            const filtered = foods.filter(f =>
                f.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredFoods(filtered);
        }
    }, [searchQuery, foods]);

    const fetchSavedFoods = async () => {
        try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_BASE}/foods`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFoods(res.data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch saved foods.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewFood(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        const errors = {};

        if (!newFood.name.trim()) errors.name = "Name is required.";
        ["base_amount", "calories", "protein", "carbs", "fats"].forEach((field) => {
            const value = parseFloat(newFood[field]);
            if (!value || value <= 0) errors[field] = `${field.replace('_', ' ')} must be > 0`;
        });

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddFood = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE}/foods`, newFood, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setNewFood({
                name: '',
                base_amount: '',
                unit: 'g',
                calories: '',
                protein: '',
                carbs: '',
                fats: ''
            });

            setFormErrors({});
            fetchSavedFoods();
            toast({ title: "Food added successfully", status: "success", isClosable: true });
        } catch (err) {
            console.error('Failed to add food: ', err);
            toast({ title: "Failed to add food", status: "error", isClosable: true });
        }
    };  

    const handleEditClick = (food) => {
        setEditingId(food.id);
        setEditingFood({ ...food });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingFood((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSaveEdit = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_BASE}/foods/${editingId}`, editingFood, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setEditingId(null);
            setEditingFood({});
            fetchSavedFoods(); // Refresh list
            toast({ title: "Food updated", status: "success", isClosable: true });
        } catch (err) {
            console.error('Failed to update food: ', err);
            setError('Failed to update food.');
            toast({ title: "Failed to update food", status: "error", isClosable: true });
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingFood({});
    }

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE}/foods/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Refresh list after delete
            fetchSavedFoods();
            toast({ title: "Food deleted", status: "success", isClosable: true });
        } catch (err) {
            console.error('Failed to delete food: ', err);
            setError('Failed to delete food.');
            toast({ title: "Failed to delete food", status: "error", isClosable: true });
        }
    };

    const confirmDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this food?')) {
            handleDelete(id);
        }
    };
 
    return (
        <Container maxW="6xl" py={10}>
            {/* Header row */}
            <Flex justify="space-between" align="center" mb={6} wrap="wrap" gap={4}>
                <Heading size="lg" color="green.600">Saved Foods</Heading>
                <Flex gap={3} align="center">
                    <InputGroup maxW="200px">
                    <InputLeftElement pointerEvents="none" children={<SearchIcon color="gray.400" />} />
                        <Input
                            placeholder="Search foods..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            size="sm"
                            borderRadius="md"
                            p={5}
                            pl={9}
                        />
                    </InputGroup>
                    <Button
                        leftIcon={<AddIcon />}
                        colorScheme="green"
                        onClick={onOpen}
                        size="sm"
                        p={5}
                    >
                    Add New Food
                    </Button>
                </Flex>
            </Flex>

            {error && <Text color="red.500">{error}</Text>}

            {foods.length === 0 ? (
                <Text color={textColor}>No saved foods yet.</Text>
            ) : isMobile ? (
                // Mobile view: Card layout
                <Stack spacing={4}>
                    {filteredFoods.map((food) => (
                        <Box
                            key={food.id}
                            p={4}
                            borderWidth="1px"
                            borderRadius="md"
                            bg={bgCard}
                            shadow="sm"
                            transition="all 0.2s"
                            _hover={{ shadow: "md" }}
                        >
                            {editingId === food.id ? (
                                <Stack spacing={2}>
                                    <FoodForm foodData={editingFood} onChange={handleEditChange} />
                                    <Flex gap={2} pt={2}>
                                        <Button size="sm" colorScheme="green" onClick={handleSaveEdit}>Save</Button>
                                        <Button size="sm" variant="ghost" onClick={handleCancelEdit}>Cancel</Button>
                                    </Flex>
                                </Stack>
                            ) : (
                                <Stack spacing={3} >
                                    {/* Food name */}
                                    <Text fontWeight="bold" fontSize="md" color="green.500">
                                        {food.name}
                                    </Text>

                                    {/* Grid layout for macros + base/unit */}
                                    <SimpleGrid columns={3} spacing={3} fontSize="sm">
                                        <Box>
                                            <Text fontWeight="semibold">Calories</Text>
                                            <Text>{food.calories} kcal</Text>
                                        </Box>
                                        <Box>
                                            <Text fontWeight="semibold">Base</Text>
                                            <Text>{food.base_amount}</Text>
                                        </Box>
                                        <Box>
                                            <Text fontWeight="semibold">Unit</Text>
                                            <Text>{food.unit}</Text>
                                        </Box>
                                        <Box>
                                            <Text fontWeight="semibold">Protein</Text>
                                            <Text>{food.protein}g</Text>
                                        </Box>
                                        <Box>
                                            <Text fontWeight="semibold">Carbs</Text>
                                            <Text>{food.carbs}g</Text>
                                        </Box>
                                        <Box>
                                            <Text fontWeight="semibold">Fats</Text>
                                            <Text>{food.fats}g</Text>
                                        </Box>
                                    </SimpleGrid>

                                    {/* Actions */}
                                    <Flex gap={3} pt={1}>
                                        <Button size="sm" variant="link" colorScheme="blue" mr={3} onClick={() => handleEditClick(food)}>
                                            Edit
                                        </Button>
                                        <Button size="sm" variant="link" colorScheme="red"  onClick={() => confirmDelete(food.id)}>
                                            Delete
                                        </Button>
                                    </Flex>
                                </Stack>
                            )}
                        </Box>
                    ))}
                </Stack>
            ) : (
                // Desktop table view
                <TableContainer bg={bgCard} p={4} borderRadius="md" shadow="sm">
                    <Table size="md" variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Name</Th>
                                <Th>Base</Th>
                                <Th>Unit</Th>
                                <Th>Calories</Th>
                                <Th>Protein</Th>
                                <Th>Carbs</Th>
                                <Th>Fats</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {filteredFoods.map((food) => (
                                <Tr key={food.id} bg={editingId === food.id ? editHighlight : undefined} transition="0.2s">
                                    {editingId === food.id ? (
                                        <>
                                            {['name', 'base_amount', 'unit', 'calories', 'protein', 'carbs', 'fats'].map((field, index) => (
                                                <Td key={index}>
                                                    <Input 
                                                        name={field}
                                                        value={editingFood[field]}
                                                        onChange={handleEditChange}
                                                        type={field === 'name' || field === 'unit' ? 'text' : 'number'}
                                                        size="sm"
                                                    />
                                                </Td>
                                            ))}
                                            <Td>
                                                <Stack direction="row" spacing={2}>
                                                    <Button size="sm" colorScheme="green" onClick={handleSaveEdit}>Save</Button>
                                                    <Button size="sm" variant="ghost" onClick={handleCancelEdit}>Cancel</Button>
                                                </Stack>
                                            </Td>
                                        </>
                                    ) : (
                                        <>
                                            <Td>{food.name}</Td>
                                            <Td>{food.base_amount}</Td>
                                            <Td>{food.unit}</Td>
                                            <Td>{food.calories}</Td>
                                            <Td>{food.protein}</Td>
                                            <Td>{food.carbs}</Td>
                                            <Td>{food.fats}</Td>
                                            <Td>
                                                <Stack direction="row" spacing={2}>
                                                    <Button size="sm" variant="link" colorScheme="blue" mr={3} onClick={() => handleEditClick(food)}>Edit</Button>
                                                    <Button size="sm" variant="link" colorScheme="red" onClick={() => confirmDelete(food.id)}>Delete</Button>
                                                </Stack>
                                            </Td>
                                        </>
                                    )}
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            )}

            {/* Add New Food Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="md">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add New Food</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FoodForm foodData={newFood} onChange={handleInputChange} formErrors={formErrors} />
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="green" mr={3} onClick={handleAddFood}>
                            Add Food
                        </Button>
                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Container>
    );
}

export default SavedFoodsPage