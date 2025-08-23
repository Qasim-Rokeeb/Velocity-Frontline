// src/components/game/CarSelection.tsx
'use client';

import * as React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Car, cars, ViperCar, ChallengerCar, PorscheCar, LamboCar } from '@/components/game/CarSprites';
import ColorPicker from './ColorPicker';


interface CarSelectionProps {
  onSelectCar: (car: Car) => void;
  selectedCar: Car | null;
  carColor: string;
  onCarColorChange: (color: string) => void;
}

export default function CarSelection({ onSelectCar, selectedCar, carColor, onCarColorChange }: CarSelectionProps) {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center space-y-6">
      <div>
          <h2 className="text-4xl font-headline text-center mb-2">Choose Your Ride</h2>
          <p className="text-center text-muted-foreground">Select a car and a color to begin.</p>
      </div>
      <Carousel
        opts={{
          align: 'start',
        }}
        className="w-full"
      >
        <CarouselContent>
          {cars.map((car) => (
            <CarouselItem key={car.id} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card
                  className={`cursor-pointer group border-2 transition-all duration-200 bg-card/50 ${
                    selectedCar?.id === car.id ? 'border-primary shadow-lg' : 'border-transparent hover:border-primary/50'
                  }`}
                  onClick={() => onSelectCar(car)}
                >
                  <CardContent className="relative flex flex-col items-center justify-center p-4">
                    <div className="w-full h-40 flex items-center justify-center mb-4">
                        {car.id === 'viper' && <ViperCar angle={0} speed={0} color={carColor} />}
                        {car.id === 'challenger' && <ChallengerCar angle={0} speed={0} color={carColor} />}
                        {car.id === 'porsche' && <PorscheCar angle={0} speed={0} color={carColor} />}
                        {car.id === 'lambo' && <LamboCar angle={0} speed={0} color={carColor} />}
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{car.name}</h3>
                    {selectedCar?.id === car.id && (
                       <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                           <CheckCircle className="h-5 w-5" />
                       </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
      <ColorPicker selectedColor={carColor} onColorChange={onCarColorChange} />
    </div>
  );
}
