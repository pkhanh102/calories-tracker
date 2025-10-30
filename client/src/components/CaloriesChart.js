import React from 'react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
    Legend,
} from 'recharts';
import dayjs from 'dayjs';
import { useColorMode } from '@chakra-ui/react';

const CaloriesChart = ({ data, calorieGoal }) => {
    const { colorMode } = useColorMode();

    const formatDay = (dateStr) => dayjs(dateStr).format('ddd');

    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload || payload.length === 0) return null;

        const data = payload[0].payload;

        const bgColor = colorMode === 'dark' ? '#2D3748' : '#FFFFFF';
        const textColor = colorMode === 'dark' ? '#F7FAFC' : '#1A202C';
        const borderColor = colorMode === 'dark' ? '#4A5568' : '#CBD5E0';

        return (
            <div style={{
                backgroundColor: bgColor,
                color: textColor,
                border: `1px solid ${borderColor}`,
                padding: "10px",
                borderRadius: "8px",
                fontSize: "14px",
                boxShadow: "0 0 10px rgba(0,0,0,0.2)"
            }}>
                <p style={{ fontWeight: "bold", marginBottom: 6 }}><strong>{dayjs(label).format("dddd", "DD-MM")}</strong></p>
                <p>Protein: {data.total_protein}g</p>
                <p>Carbs: {data.total_carbs}g</p>
                <p>Fats: {data.total_fats}g</p>
                <p style={{ marginTop: 6 }}><strong>Total: {(data.protein_cals + data.carb_cals + data.fat_cals).toFixed(0)} kcal</strong></p>
            </div>
        );
    };

    return (
        <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                dataKey="date"
                tickFormatter={formatDay}
                />
                <YAxis domain={[0, Math.max(...data.map(d => d.total_calories), calorieGoal) * 1.1]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <ReferenceLine 
                    y={calorieGoal} 
                    stroke="#E53E3E" 
                    strokeWidth={2}
                    strokeDasharray="6 3"
                    label={{
                        value: `Goal: ${calorieGoal} kcal`,
                        position: 'insideTopRight',
                        offset: 10,
                        fill: '#E53E3E',
                        fontSize: 13,
                        fontWeight: 'bold',
                    }}
                />
                <Bar dataKey="protein_cals" stackId="a" fill="#F56565" name="Protein" />  
                <Bar dataKey="carb_cals" stackId="a" fill="#ECC94B" name="Carbs" />    
                <Bar dataKey="fat_cals" stackId="a" fill="#4299E1" name="Fats" />      
            </BarChart>
        </ResponsiveContainer>
    );
};

export default CaloriesChart;