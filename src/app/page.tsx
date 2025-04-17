"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { List, ListItem } from "@/components/ui/list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const IVA_RATE = 0.21;
const MIN_DISPLACEMENT_CHARGE = 15;

export default function Home() {
  const [materials, setMaterials] = useState<string[]>([]);
  const [newMaterial, setNewMaterial] = useState("");
  const [hoursWorked, setHoursWorked] = useState<number>(0);
  const [hourlyRate, setHourlyRate] = useState<number>(50); // Example default
  const [kilometers, setKilometers] = useState<number>(0);
  const [ratePerKilometer, setRatePerKilometer] = useState<number>(0.5); // Example default
  const [subtotal, setSubtotal] = useState<number>(0);
  const [iva, setIva] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const addMaterial = () => {
    if (newMaterial.trim() !== "") {
      setMaterials([...materials, newMaterial]);
      setNewMaterial("");
    }
  };

  const deleteMaterial = (index: number) => {
    const updatedMaterials = [...materials];
    updatedMaterials.splice(index, 1);
    setMaterials(updatedMaterials);
  };

  const calculateInvoice = () => {
    // Calculate materials cost (assuming each material costs 1 unit for simplicity)
    const materialsCost = materials.length;

    // Calculate hours cost
    const hoursCost = hoursWorked * hourlyRate;

    // Calculate displacement cost
    let displacementCost = kilometers * 2 * ratePerKilometer;
    displacementCost = displacementCost < MIN_DISPLACEMENT_CHARGE ? MIN_DISPLACEMENT_CHARGE : displacementCost;

    // Calculate subtotal
    const newSubtotal = materialsCost + hoursCost + displacementCost;
    setSubtotal(newSubtotal);

    // Calculate IVA
    const newIva = newSubtotal * IVA_RATE;
    setIva(newIva);

    // Calculate total
    const newTotal = newSubtotal + newIva;
    setTotal(newTotal);
  };

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Materials Input */}
      <Card className="bg-gray-100">
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
            />
            <Button onClick={addMaterial}>Add</Button>
          </div>
          <List className="mt-2">
            {materials.map((material, index) => (
              <ListItem key={index} className="flex justify-between items-center">
                {material}
                <Button variant="outline" size="sm" onClick={() => deleteMaterial(index)}>
                  Delete
                </Button>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Hours Calculation */}
      <Card className="bg-gray-100">
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
            />
            <Input
              type="number"
              placeholder="Hourly rate"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Displacement Calculation */}
      <Card className="bg-gray-100">
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
            />
            <Input
              type="number"
              placeholder="Rate per kilometer"
              value={ratePerKilometer}
              onChange={(e) => setRatePerKilometer(Number(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Total Calculation and Display */}
      <Card className="bg-gray-100">
        <CardHeader>
          <CardTitle>Invoice Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          <Button onClick={calculateInvoice} className="bg-blue-300 text-black">
            Calculate Invoice
          </Button>
          <div>Subtotal: {subtotal.toFixed(2)}</div>
          <div>IVA (21%): {iva.toFixed(2)}</div>
          <div>Total: {total.toFixed(2)}</div>
        </CardContent>
      </Card>
        <Toaster />
    </div>
  );
}

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const toasts = []

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
