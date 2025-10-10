import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import API_BASE from "../apiConfig";
import {
  Container,
  Heading,
  Text,
  Stack,
  Divider,
  Spinner,
  Flex,
  useColorModeValue,
  SimpleGrid,
  Box,
  Progress,
  useBreakpointValue
} from '@chakra-ui/react';
import { percent } from 'framer-motion';

function DashboardPage() {
    const navigate = useNavigate();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    const cardBg = useColorModeValue("white", "gray.800");
    const cardBorder = useColorModeValue("gray.200", "gray.700");

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchSummary = async () => {
            try {
                const today = dayjs().format('YYYY-MM-DD');
                const res = await axios.get(`${API_BASE}/summary?date=${today}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setSummary(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch summary:', err);
                setLoading(false);
            }
        };

        fetchSummary();
    }, [navigate]);

    const getProgressBarColor = (percent) => {
        if (percent < 60) return "blue";
        if (percent < 90) return "orange";
        return "green";
    }

    const isMobile = useBreakpointValue({ base: true, md: false});

    if (loading) return (
        <Flex p={10} align="center" justify="center" direction="column" minH="50vh">
            <Spinner size="lg" color="green.500" />
            <Text mt={4}>Loading...</Text>
        </Flex>
    );

    return (
        <Container maxW="4xl" py={10}>
            {/* Page Title */}
            <Heading as="h2" size="xl" color="green.600" mb={8}>Dashboard</Heading>
            <Text fontSize="lg" color="gray.600" mb={6}>
                Welcome back 👋 Ready to crush your goals today?
            </Text>

            {/* Nutrition Summary Section */}
            <Box mb={10} p={[4, 6]} borderWidth="1px" borderRadius="md" bg={cardBg} borderColor={cardBorder} shadow="sm">
                <Heading as="h3" size="md" mb={4}>Today's Nutrition Summary</Heading>

                {summary ? (
                    <SimpleGrid column={[1, 2]} spacing={4}>
                        {[
                            { label: "🔥 Calories", value: summary.totals.calories, goal: summary.goals.calories_goal, unit: "kcal" },
                            { label: "🍗 Protein", value: summary.totals.protein, goal: summary.goals.protein_goal_g, unit: "g" },
                            { label: "🍞 Carbs", value: summary.totals.carbs, goal: summary.goals.carb_goal_g, unit: "g" },
                            { label: "🥑 Fats", value: summary.totals.fats, goal: summary.goals.fat_goal_g, unit: "g" }
                        ].map((item, idx) => {
                            const percent = Math.min((item.value / item.goal) * 100, 100);
                            return (
                            <Box key={idx}>
                                <Flex justify="space-between" mb={1}>
                                    <Text fontWeight="medium">{item.label}</Text>
                                    <Text fontSize="sm">{item.value} / {item.goal} {item.unit}</Text>
                                </Flex>
                                <Progress
                                    value={percent}
                                    size="sm"
                                    colorScheme={getProgressBarColor(percent)}
                                    borderRadius="md"
                                    transition="all 0.4s ease"
                                />
                            </Box>
                            );
                        })}
                    </SimpleGrid>
                ) : (
                    <Text color="gray.500">No summary available.</Text>
                )}
            </Box>
                
            <Divider mb={10} />

            {/* Logged Foods */}
            <Box>
                <Heading as="h3" size="md" mb={6}>Today's Log</Heading>
                {summary?.by_meal ? (
                    ['breakfast', 'lunch', 'dinner', 'snack'].map(meal => (
                        <Box key={meal} mb={8}>
                            <Flex align="center" mb={3}>
                                <Heading as="h4" size="sm" color="green.500" textTransform="capitalize">
                                    {meal}
                                </Heading>
                            </Flex>

                            {summary.by_meal[meal] && summary.by_meal[meal].length > 0 ? (
                                <Stack spacing={3}>
                                    {summary.by_meal[meal].map(item => (
                                        <Box
                                            key={item.id}
                                            p={4}
                                            borderWidth="1px"
                                            borderRadius="md"
                                            bg="gray.50"
                                            shadow="sm"
                                            transition="all 0.2s"
                                            _hover={{ shadow: "md", transform: "translateY(-2px)" }}
                                        >
                                            <Text fontWeight="semibold" fontSize="md">
                                                {item.name} - {item.consumed_amount}{item.unit}
                                            </Text>

                                            <SimpleGrid columns={[2, null, 4]} spacing={3} mt={2} fontSize="sm" color="gray.700">
                                                <Box>
                                                    <Text fontWeight="medium">🔥 Calories</Text>
                                                    <Text>{item.calculated_calories} kcal</Text>
                                                </Box>
                                                <Box>
                                                    <Text fontWeight="medium">🍗 Protein</Text>
                                                    <Text>{item.calculated_protein}g</Text>
                                                </Box>
                                                <Box>
                                                    <Text fontWeight="medium">🍞 Carbs</Text>
                                                    <Text>{item.calculated_carbs}g</Text>
                                                </Box>
                                                <Box>
                                                    <Text fontWeight="medium">🥑 Fats</Text>
                                                    <Text>{item.calculated_fats}g</Text>
                                                </Box>
                                            </SimpleGrid>
                                        </Box>
                                    ))}
                                </Stack>
                            ) : (
                                <Text color="gray.500">No items logged.</Text>
                            )}
                        </Box>
                    ))
                ) : (
                    <Text color="gray.500">Loading log data...</Text>
                )}
            </Box>
        </Container>
    );
}

export default DashboardPage;