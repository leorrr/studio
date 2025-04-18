"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { List, ListItem } from "@/components/ui/list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

type Material = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
};

export default function Home() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [newMaterialName, setNewMaterialName] = useState("");
  const [newMaterialQuantity, setNewMaterialQuantity] = useState<number | undefined>(undefined);
  const [newMaterialPrice, setNewMaterialPrice] = useState<number | undefined>(undefined);

  const [hoursWorked, setHoursWorked] = useState<number>(0);
  const [kilometers, setKilometers] = useState<number>(0);

  const [subtotal, setSubtotal] = useState<number>(0);
  const [iva, setIva] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const { toast } = useToast()

  const [materialsCost, setMaterialsCost] = useState<number>(0);
  const [hoursCost, setHoursCost] = useState<number>(0);
  const [displacementCost, setDisplacementCost] = useState<number>(0);

  // Preference values
  const [hourlyRate, setHourlyRate] = useState<number>(35);
  const [ratePerKilometer, setRatePerKilometer] = useState<number>(0.40);
  const [minDisplacementCharge, setMinDisplacementCharge] = useState<number>(15);
  const [ivaRate, setIvaRate] = useState<number>(0.21);

    // Preference values temp state for dialog
  const [tempHourlyRate, setTempHourlyRate] = useState<number>(35);
  const [tempRatePerKilometer, setTempRatePerKilometer] = useState<number>(0.40);
  const [tempMinDisplacementCharge, setTempMinDisplacementCharge] = useState<number>(15);
  const [tempIvaRate, setTempIvaRate] = useState<number>(0.21);

    const [open, setOpen] = useState(false);


  const addMaterial = () => {
    if (newMaterialName.trim() !== "" && newMaterialPrice !== undefined && newMaterialQuantity !== undefined) {
      const newTotal = newMaterialQuantity * newMaterialPrice;
      setMaterials([...materials, { 
        id: crypto.randomUUID(),
        name: newMaterialName, 
        quantity: newMaterialQuantity, 
        price: newMaterialPrice, 
        total: newTotal }]);
      setNewMaterialName("");
      setNewMaterialQuantity(0);
      setNewMaterialPrice(0);
      toast({
        title: "Material Added",
        description: "The material has been successfully added to the list.",
      });
    } else {
         toast({
        title: "Error",
        description: "Please enter material name, quantity, and price.",
        variant: "destructive"
      });
    }
  };

  const deleteMaterial = (id: string) => {
    const updatedMaterials = materials.filter(material => material.id !== id);
    setMaterials(updatedMaterials);
    toast({
      title: "Material Deleted",
      description: "The material has been successfully deleted from the list.",
    });
  };

    const updateMaterial = (id: string, updatedFields: Partial<Material>) => {
        const updatedMaterials = materials.map(material => {
            if (material.id === id) {
                return { ...material, ...updatedFields, total: (updatedFields.quantity || material.quantity) * (updatedFields.price || material.price) };
            }
            return material;
        });
        setMaterials(updatedMaterials);
    };

  useEffect(() => {
    // Calculate materials cost
    const newMaterialsCost = materials.reduce((sum, material) => sum + material.total, 0);
    setMaterialsCost(newMaterialsCost);

    // Calculate hours cost
    const newHoursCost = hoursWorked * hourlyRate;
    setHoursCost(newHoursCost);

    // Calculate displacement cost
    let newDisplacementCost = 0;
    if (kilometers === 0) {
      newDisplacementCost = 0;
    } else {
      newDisplacementCost = kilometers * 2 * ratePerKilometer;
      newDisplacementCost = newDisplacementCost < minDisplacementCharge ? minDisplacementCharge : newDisplacementCost;
    }
    setDisplacementCost(newDisplacementCost)

    // Calculate subtotal
    const newSubtotal = newMaterialsCost + newHoursCost + newDisplacementCost;
    setSubtotal(newSubtotal);

    // Calculate IVA
    const newIva = newSubtotal * ivaRate;
    setIva(newIva);

    // Calculate total
    const newTotal = newSubtotal + newIva;
    setTotal(newTotal);
  }, [materials, hoursWorked, kilometers, hourlyRate, ratePerKilometer, minDisplacementCharge, ivaRate]);

  const handlePreferencesSave = () => {
        setHourlyRate(tempHourlyRate);
        setRatePerKilometer(tempRatePerKilometer);
        setMinDisplacementCharge(tempMinDisplacementCharge);
        setIvaRate(tempIvaRate);
        setOpen(false);
    };

    const handlePreferencesCancel = () => {
        setTempHourlyRate(hourlyRate);
        setTempRatePerKilometer(ratePerKilometer);
        setTempMinDisplacementCharge(minDisplacementCharge);
        setTempIvaRate(ivaRate);
        setOpen(false);
    };

    const handlePreferencesOpen = () => {
        setTempHourlyRate(hourlyRate);
        setTempRatePerKilometer(ratePerKilometer);
        setTempMinDisplacementCharge(minDisplacementCharge);
        setTempIvaRate(ivaRate);
    };


  return (
    <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

      {/* Materials Input */}
      <Card className="bg-gray-100 rounded-lg shadow-md">
        <CardHeader>
          <CardTitle>Materials</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="grid gap-2 mb-2">
            <Label htmlFor="materialName">Material Name</Label>
            <Input
              type="text"
              id="materialName"
              placeholder="Material name"
              value={newMaterialName}
              onChange={(e) => setNewMaterialName(e.target.value)}
              className="border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <Label htmlFor="materialQuantity">Quantity</Label>
             <Input
              type="number"
              id="materialQuantity"
              placeholder="Quantity"
              value={newMaterialQuantity}
              onChange={(e) => setNewMaterialQuantity(Number(e.target.value))}
              className="border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <Label htmlFor="materialPrice">Unit Price</Label>
            <Input
              type="number"
              id="materialPrice"
              placeholder="Unit price"
              value={newMaterialPrice}
              onChange={(e) => setNewMaterialPrice(Number(e.target.value))}
              className="border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            
            <Button onClick={addMaterial} className="bg-blue-300 text-black rounded-md shadow-sm hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50">Add</Button>
          </div>
          <List className="mt-2">
            {materials.map((material, index) => (
              <ListItem key={material.id} className="flex justify-between items-center py-2 px-3 border-b border-gray-200 last:border-b-0">
                
                <div className="grid grid-cols-4 gap-2">
                    <div>
                        <Label htmlFor={`materialName-${material.id}`}>Name</Label>
                        <Input
                            type="text"
                            id={`materialName-${material.id}`}
                            value={material.name}
                            onChange={(e) => updateMaterial(material.id, { name: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label htmlFor={`materialQuantity-${material.id}`}>Quantity</Label>
                        <Input
                            type="number"
                            id={`materialQuantity-${material.id}`}
                            value={material.quantity}
                            onChange={(e) => updateMaterial(material.id, { quantity: Number(e.target.value) })}
                        />
                    </div>
                    <div>
                        <Label htmlFor={`materialPrice-${material.id}`}>Price</Label>
                        <Input
                            type="number"
                            id={`materialPrice-${material.id}`}
                            value={material.price}
                            onChange={(e) => updateMaterial(material.id, { price: Number(e.target.value) })}
                        />
                    </div>
                    <div>
                        Total: ${material.total.toFixed(2)}
                    </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => deleteMaterial(material.id)} className="text-red-500 hover:text-red-700 focus:outline-none">
                  Delete
                </Button>
              </ListItem>
            ))}
          </List>
          <div>Total Material Cost: ${materialsCost.toFixed(2)}</div>
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
          </div>
          <div>Total Hours Cost: ${hoursCost.toFixed(2)}</div>
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
          </div>
          <div>Displacement Cost: ${displacementCost.toFixed(2)}</div>
        </CardContent>
      </Card>

      {/* Total Calculation and Display */}
      <Card className="bg-gray-100 rounded-lg shadow-md">
        <CardHeader>
          <CardTitle>Invoice Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          <div>Subtotal: ${subtotal.toFixed(2)}</div>
          <div>IVA ({ivaRate * 100}%): ${iva.toFixed(2)}</div>
          <div>Total: ${total.toFixed(2)}</div>
        </CardContent>
      </Card>
      
      {/* Preferences Menu */}
        <div className="fixed bottom-4 right-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Preferences</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Preferences</DialogTitle>
              <DialogDescription>
                Adjust the values used for invoice calculations.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="hourlyRate" className="text-right">
                  Hourly Rate
                </Label>
                <Input
                  type="number"
                  id="hourlyRate"
                  value={tempHourlyRate}
                  onChange={(e) => setTempHourlyRate(Number(e.target.value))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ratePerKilometer" className="text-right">
                  Rate per Kilometer
                </Label>
                <Input
                  type="number"
                  id="ratePerKilometer"
                  value={tempRatePerKilometer}
                  onChange={(e) => setTempRatePerKilometer(Number(e.target.value))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="minDisplacementCharge" className="text-right">
                  Min. Displacement Charge
                </Label>
                <Input
                  type="number"
                  id="minDisplacementCharge"
                  value={tempMinDisplacementCharge}
                  onChange={(e) => setTempMinDisplacementCharge(Number(e.target.value))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ivaRate" className="text-right">
                  IVA Rate (%)
                </Label>
                <Input
                  type="number"
                  id="ivaRate"
                  value={tempIvaRate}
                  onChange={(e) => setTempIvaRate(Number(e.target.value))}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={handlePreferencesCancel}>
                Cancel
              </Button>
              <Button type="button" onClick={handlePreferencesSave}>
                OK
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
      <Toaster />
    </div>
  );
}
