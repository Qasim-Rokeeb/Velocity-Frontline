// src/components/game/DifficultyPanel.tsx
"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getDifficultyAdjustment } from "@/lib/actions";
import { AdjustDifficultyOutput } from "@/ai/flows/dynamic-difficulty";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BrainCircuit, Loader2, Gauge, TrendingUp, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "../ui/separator";

const formSchema = z.object({
  averageLapTime: z.coerce.number().min(0, "Must be positive").default(60),
  numCompletedLaps: z.coerce.number().int().min(0, "Must be positive").default(5),
  numCollisions: z.coerce.number().int().min(0, "Must be positive").default(2),
});

type FormData = z.infer<typeof formSchema>;

export default function DifficultyPanel() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<AdjustDifficultyOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      averageLapTime: 60,
      numCompletedLaps: 5,
      numCollisions: 2,
    },
  });

  const onSubmit = (values: FormData) => {
    startTransition(async () => {
      const { success, data, error } = await getDifficultyAdjustment(values);
      if (success && data) {
        setResult(data);
        toast({
            title: "Analysis Complete",
            description: "New AI difficulty settings have been generated.",
        });
      } else {
        setResult(null);
        toast({
            variant: "destructive",
            title: "Analysis Failed",
            description: error || "An unknown error occurred.",
        });
      }
    });
  };

  return (
    <Card className="bg-card/50">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <BrainCircuit className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Dynamic Difficulty</CardTitle>
                <CardDescription>Let AI adjust the challenge based on performance.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="averageLapTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Average Lap Time (s)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" placeholder="e.g., 60.5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numCompletedLaps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Completed Laps</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numCollisions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Collisions</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col items-stretch">
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
              {isPending ? 'Analyzing...' : 'Analyze Performance'}
            </Button>
            {result && (
              <div className="mt-4 space-y-4 text-sm">
                <Separator />
                <h3 className="text-center font-semibold text-foreground">AI Recommendations</h3>
                <div className="flex justify-around">
                    <div className="text-center">
                        <p className="text-muted-foreground flex items-center gap-1 justify-center"><Gauge className="h-4 w-4" /> Speed</p>
                        <p className="text-2xl font-bold text-primary">{result.opponentSpeedMultiplier.toFixed(2)}x</p>
                    </div>
                    <div className="text-center">
                        <p className="text-muted-foreground flex items-center gap-1 justify-center">
                            {result.opponentAggressionFactor > 1 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                             Aggression
                        </p>
                        <p className="text-2xl font-bold text-primary">{result.opponentAggressionFactor.toFixed(2)}x</p>
                    </div>
                </div>
              </div>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
