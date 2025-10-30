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
  Button,
  useToast,
} from '@chakra-ui/react';
import CaloriesChart from "../components/CaloriesChart";

function DashboardPage() {
    const navigate = useNavigate();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const itemBg = useColorModeValue("white", "gray.700");
    const itemBorder = useColorModeValue("gray.200", "gray.600");
    const textColor = useColorModeValue('gray.700', 'gray.200');
    const mutedText = useColorModeValue('gray.500', 'gray.400');
    const hiText = useColorModeValue('gray.600', 'gray.300');

    const newBg = useColorModeValue("green.50", "green.900");
    const newBorderColor = useColorModeValue("green.200", "green.600");

    const streakBg = useColorModeValue("blue.50", "blue.900");
    const streakBorder = useColorModeValue("blue.200", "blue.600");
    const noStreakBg = useColorModeValue("gray.50", "gray.800");
    const noStreakBorder = useColorModeValue("gray.200", "gray.600");
    const streakLabelColor = useColorModeValue("blue.600", "blue.300");
    const streakValueColor = useColorModeValue("blue.700", "blue.100");

    const [chartData, setChartData] = useState([]);
    const toast = useToast();

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
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSummary(res.data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch summary:', err);
                setError("Failed to load dashboard data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        const fetch7DaySummary = async () => {
            try {
                const res = await axios.get(`${API_BASE}/summary/7days`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setChartData(res.data);
            } catch (err) {
                console.error('Failed to fetch 7-day chart data:', err);
                toast({
                    title: "Error loading chart",
                    description: "Could not fetch 7-day calorie summary.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        };

        fetchSummary();
        fetch7DaySummary();
    }, [navigate, toast]);

    const getProgressBarColor = (percent) => {
        if (percent < 60) return "blue";
        if (percent < 90) return "orange";
        return "green";
    }

    const handleRetry = () => {
        setLoading(true);
        setError(null);
        setSummary(null);

        const today = dayjs().format('YYYY-MM-DD');
        const token = localStorage.getItem('token');
        axios.get(`${API_BASE}/summary?date=${today}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            setSummary(res.data);
        })
        .catch(err => {
            console.error('Retry failed:', err);
            setError("Still unable to load data");
        })
        .finally(() => {
            setLoading(false);
        });
    };

    const processedChartData = chartData.map(item => ({
        ...item,
        protein_cals: item.total_protein * 4,
        carb_cals: item.total_carbs * 4,
        fat_cals: item.total_fats * 9
    }));

    const computeStreak = (chartData) => {
        const sorted = [...chartData].sort((a, b) => new Date(b.date) - new Date(a.date));

        let streak = 0;
        for (let day of sorted) {
            const hasLogged = day.total_calories > 0;
            if (hasLogged) {
                streak += 1;
            } else {
                break;
            }
        }
        return streak;
    }

    // const isMobile = useBreakpointValue({ base: true, md: false});

    if (loading) return (
        <Flex p={10} align="center" justify="center" direction="column" minH="50vh">
            <Spinner size="lg" color="green.500" />
            <Text mt={4}>Loading...</Text>
        </Flex>
    );

    if (error) {
        return (
            <Flex p={10} align="center" justify="center" direction="column" minH="50vh">
                <Text fontSize="lg" color="red.500" mb={3}>{error}</Text>
                <Button onClick={handleRetry} colorScheme="green">Retry</Button>
            </Flex>
        );
    }

    const streak = computeStreak(chartData);

    return (
        <Container maxW="4xl" py={10} minH="100vh">
            {/* Page Title */}
            <Heading as="h2" size="xl" color="green.600" mb={8}>Dashboard</Heading>
            <Text fontSize="lg" color={hiText} mb={6}>
                Welcome back 👋 Ready to crush your goals today?
            </Text>

            {/* Top highlight summary box */}
            <Box
                mb={6}
                p={5}
                borderWidth="1px"
                borderRadius="md"
                bg={newBg}
                borderColor={newBorderColor}
                shadow="sm"
            >
                <Heading size="sm" mb={2}>Quick Summary</Heading>
                {summary ? (
                    <Flex direction={["column", "row"]} justify="space-between" gap={4}>
                        <Box>
                            <Text fontSize="sm" color="gray.500">Total Calories</Text>
                            <Text fontSize="2xl" fontWeight="bold">{summary.totals.calories} kcal</Text>
                        </Box>
                        <Box>
                            <Text fontSize="sm" color="gray.500">Protein</Text>
                            <Text fontSize="lg" fontWeight="semibold">{summary.totals.protein}g / {summary.goals.protein_goal_g}g</Text>
                        </Box>
                        <Box>
                            <Text fontSize="sm" color="gray.500">Carbs</Text>
                            <Text fontSize="lg" fontWeight="semibold">{summary.totals.carbs}g / {summary.goals.carb_goal_g}g</Text>
                        </Box>
                        <Box>
                            <Text fontSize="sm" color="gray.500">Fats</Text>
                            <Text fontSize="lg" fontWeight="semibold">{summary.totals.fats}g / {summary.goals.fat_goal_g}g</Text>
                        </Box>
                    </Flex>
                ) : (
                    <Text color="gray.500">No data available yet.</Text>
                )}
            </Box>

            {/* Nutrition Summary Section */}
            <Box mb={10} p={[4, 6]} borderWidth="1px" borderRadius="md" bg={itemBg} borderColor={itemBorder} shadow="sm">
                <Heading as="h3" size="md" mb={4} display="flex" alignItems="center" gap={2}>Macro Progress</Heading>

                {summary ? (
                    <SimpleGrid columns={[1, 2]} spacing={6}>
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
                                    size="md"
                                    colorScheme={getProgressBarColor(percent)}
                                    borderRadius="md"
                                    transition="all 0.4s ease"
                                />
                            </Box>
                            );
                        })}
                    </SimpleGrid>
                ) : (
                    <Text color={mutedText}>No summary available.</Text>
                )}
            </Box>
                
            <Divider mb={10} />

            {/* 7-Day Calorie Chart Section */}
            <Box mb={10} p={[4, 6]} borderWidth="1px" borderRadius="md" bg={itemBg} borderColor={itemBorder} shadow="sm">
                <Heading as="h3" size="md" mb={4} display="flex" alignItems="center" gap={2}>7-Day Calorie Trend</Heading>
                { streak > 0 ? (
                    <Box
                        mb={6}
                        p={4}
                        bg={streakBg}
                        borderWidth="1px"
                        borderRadius="md"
                        borderColor={streakBorder}
                        textAlign="center"
                    > 
                        <Text fontSize="sm" color={streakLabelColor}>Logging Streak</Text>
                        <Text fontSize="2xl" fontWeight="bold" color={streakValueColor}>
                            🔥 {streak} {streak === 1 ? "day" : "days"}
                        </Text>
                    </Box>
                ) : (
                    <Box 
                        mb={6}
                        p={4}
                        bg={noStreakBg}
                        borderWidth="1px"
                        borderRadius="md"
                        borderColor={noStreakBorder}
                        textAlign="center"
                    >
                        <Text fontSize="sm" color={mutedText}>No streak yet</Text>
                        <Text fontSize="md" color={mutedText}>
                            Start logging daily to build your streak!
                        </Text>
                    </Box>
                )}

                {chartData && chartData.length > 0 ? (
                    <CaloriesChart data={processedChartData} calorieGoal={summary?.goals?.calories_goal || 2000} />
                ) : (
                    <Text color={mutedText}>Chart data not available.</Text>
                )}
            </Box>
            <Divider mb={10} />

            
            {/* Logged Foods */}
            <Box>
                <Heading as="h3" size="md" mb={6} display="flex" alignItems="center" gap={2}>Today's Meals</Heading>
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
                                            p={[3, 4]}
                                            borderWidth="1px"
                                            borderRadius="md"
                                            bg={itemBg}
                                            borderColor={itemBorder}
                                            shadow="sm"
                                            transition="all 0.2s"
                                            _hover={{ shadow: "md", transform: "translateY(-2px)" }}
                                        >
                                            <Text fontWeight="semibold" fontSize="md">
                                                {item.name} - {item.consumed_amount}{item.unit}
                                            </Text>

                                            <SimpleGrid columns={[2, null, 4]} spacing={[2, 3]} mt={2} fontSize="sm" color={textColor}>
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
                                <Text color={mutedText}>No items logged.</Text>
                            )}
                        </Box>
                    ))
                ) : (
                    <Text color={mutedText}>Loading log data...</Text>
                )}
            </Box>
        </Container>
    );
}

export default DashboardPage;