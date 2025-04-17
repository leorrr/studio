"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { List, ListItem } from "@/components/ui/list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

const IVA_RATE = 0.21;
const MIN_DISPLACEMENT_CHARGE = 15;

export default function Home() {
  const [materials, setMaterials] = useState<string[]>([]);
  const [newMaterial, setNewMaterial] = useState("");
  const [hoursWorked, setHoursWorked] = useState<number>(0);
  const [hourlyRate, setHourlyRate] = useState<number>(35); // Example default
  const [kilometers, setKilometers] = useState<number>(0);
  const [ratePerKilometer, setRatePerKilometer] = useState<number>(0.40); // Example default
  const [subtotal, setSubtotal] = useState<number>(0);
  const [iva, setIva] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const { toast } = useToast()

    const [materialsCost, setMaterialsCost] = useState<number>(0);
    const [hoursCost, setHoursCost] = useState<number>(0);
    const [displacementCost, setDisplacementCost] = useState<number>(0);

      const [totalMaterialsCostInput, setTotalMaterialsCostInput] = useState<number>(0);


  const addMaterial = () => {
    if (newMaterial.trim() !== "") {
      setMaterials([...materials, newMaterial]);
      setNewMaterial("");
       toast({
        title: "Material Added",
        description: "The material has been successfully added to the list.",
      })
    }
  };

  const deleteMaterial = (index: number) => {
    const updatedMaterials = [...materials];
    updatedMaterials.splice(index, 1);
    setMaterials(updatedMaterials);
     toast({
        title: "Material Deleted",
        description: "The material has been successfully deleted from the list.",
      })
  };

    const handleTotalMaterialsCostInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        setTotalMaterialsCostInput(value);
    };

  useEffect(() => {
    // Calculate materials cost (assuming each material costs 1 unit for simplicity)
    //const newMaterialsCost = materials.length;
    //setMaterialsCost(newMaterialsCost);
      setMaterialsCost(totalMaterialsCostInput);

    // Calculate hours cost
    const newHoursCost = hoursWorked * hourlyRate;
    setHoursCost(newHoursCost);

    // Calculate displacement cost
    let newDisplacementCost = kilometers * 2 * ratePerKilometer;
    newDisplacementCost = newDisplacementCost < MIN_DISPLACEMENT_CHARGE ? MIN_DISPLACEMENT_CHARGE : newDisplacementCost;
    setDisplacementCost(newDisplacementCost)

    // Calculate subtotal
    const newSubtotal = totalMaterialsCostInput + newHoursCost + newDisplacementCost;
    setSubtotal(newSubtotal);

    // Calculate IVA
    const newIva = newSubtotal * IVA_RATE;
    setIva(newIva);

    // Calculate total
    const newTotal = newSubtotal + newIva;
    setTotal(newTotal);
  }, [materials, hoursWorked, hourlyRate, kilometers, ratePerKilometer, totalMaterialsCostInput]);

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Materials Input */}
      <Card className="bg-gray-100 rounded-lg shadow-md">
        <CardHeader>
          <CardTitle>Materials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Add material"
              value={newMaterial}
              onChange={(e) => setNewMaterial(e.target.value)}
              className="border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <Button onClick={addMaterial} className="bg-blue-300 text-black rounded-md shadow-sm hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50">Add</Button>
          </div>
          <List className="mt-2">
            {materials.map((material, index) => (
              <ListItem key={index} className="flex justify-between items-center py-2 px-3 border-b border-gray-200 last:border-b-0">
                {material}
                <Button variant="outline" size="sm" onClick={() => deleteMaterial(index)} className="text-red-500 hover:text-red-700 focus:outline-none">
                  Delete
                </Button>
              </ListItem>
            ))}
          </List>
            {/*<div>Total Material Cost: {materialsCost.toFixed(2)}</div>*/}
           <div>Total Material Cost: {materialsCost.toFixed(2)}</div>
            <Input
                type="number"
                placeholder="Total material cost"
                value={totalMaterialsCostInput}
                onChange={handleTotalMaterialsCostInputChange}
                className="border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                hidden={true}
            />
        </CardContent>
      </Card>

      {/* Hours Calculation */}
      <Card className="bg-gray-100 rounded-lg shadow-md">
        <CardHeader>
          <CardTitle>Hours Worked</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <Input
              type="number"
              placeholder="Hours worked"
              value={hoursWorked}
              onChange={(e) => setHoursWorked(Number(e.target.value))}
              className="border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <Input
              type="number"
              placeholder="Hourly rate"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
             <div>Total Hours Cost: {hoursCost.toFixed(2)}</div>
        </CardContent>
      </Card>

      {/* Displacement Calculation */}
      <Card className="bg-gray-100 rounded-lg shadow-md">
        <CardHeader>
          <CardTitle>Displacement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <Input
              type="number"
              placeholder="Kilometers (one way)"
              value={kilometers}
              onChange={(e) => setKilometers(Number(e.target.value))}
              className="border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <Input
              type="number"
              placeholder="Rate per kilometer"
              value={ratePerKilometer}
              onChange={(e) => setRatePerKilometer(Number(e.target.value))}
              className="border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
           <div>Displacement Cost: {displacementCost.toFixed(2)}</div>
        </CardContent>
      </Card>

      {/* Total Calculation and Display */}
      <Card className="bg-gray-100 rounded-lg shadow-md">
        <CardHeader>
          <CardTitle>Invoice Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          <div>Subtotal: {subtotal.toFixed(2)}</div>
          <div>IVA (21%): {iva.toFixed(2)}</div>
          <div>Total: {total.toFixed(2)}</div>
        </CardContent>
      </Card>
        <Toaster />
    </div>
  );
}
