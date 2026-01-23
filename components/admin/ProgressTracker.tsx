"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Clock, Circle } from "lucide-react";

type ProgressStatus = "NOT_STARTED" | "IN_PROGRESS" | "MASTERED";

interface Progress {
  id: string;
  status: ProgressStatus;
  completedAt: Date | null;
  instructorNotes: string | null;
}

interface Item {
  id: string;
  itemName: string;
  description: string | null;
  order: number;
  isRequired: boolean;
  videoUrl: string | null;
}

interface ProgressTrackerProps {
  item: Item;
  progress?: Progress;
  studentId: string;
}

export default function ProgressTracker({
  item,
  progress,
  studentId,
}: ProgressTrackerProps) {
  const [currentStatus, setCurrentStatus] = useState<ProgressStatus>(
    progress?.status || "NOT_STARTED"
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState(progress?.instructorNotes || "");

  const updateProgress = async (newStatus: ProgressStatus) => {
    setIsUpdating(true);
    try {
      const response = await fetch("/api/curriculum/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          curriculumId: item.id,
          status: newStatus,
          instructorNotes: notes || null,
        }),
      });

      if (response.ok) {
        setCurrentStatus(newStatus);
        // Refresh the page to update stats
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to update progress:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: ProgressStatus) => {
    switch (status) {
      case "MASTERED":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-500/50";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-500/50";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300 border-gray-500/50";
    }
  };

  const getStatusIcon = (status: ProgressStatus) => {
    switch (status) {
      case "MASTERED":
        return <Check className='h-4 w-4' />;
      case "IN_PROGRESS":
        return <Clock className='h-4 w-4' />;
      default:
        return <Circle className='h-4 w-4' />;
    }
  };

  return (
    <div className='p-4 rounded-lg border bg-card'>
      <div className='flex items-start gap-4'>
        {/* Order Number */}
        <div className='shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium'>
          {item.order}
        </div>

        {/* Content */}
        <div className='flex-1 min-w-0'>
          <div className='flex items-start justify-between gap-4 mb-3'>
            <div className='flex-1'>
              <h3 className='font-semibold text-base'>{item.itemName}</h3>
              {item.description && (
                <p className='text-sm text-muted-foreground mt-1'>
                  {item.description}
                </p>
              )}
            </div>

            {/* Current Status Badge */}
            <Badge
              variant='outline'
              className={`flex items-center gap-1 ${getStatusColor(
                currentStatus
              )}`}
            >
              {getStatusIcon(currentStatus)}
              <span className='capitalize'>
                {currentStatus.replace("_", " ").toLowerCase()}
              </span>
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className='flex items-center gap-2 flex-wrap'>
            <Button
              variant={currentStatus === "NOT_STARTED" ? "default" : "outline"}
              size='sm'
              onClick={() => updateProgress("NOT_STARTED")}
              disabled={isUpdating || currentStatus === "NOT_STARTED"}
            >
              <Circle className='h-3 w-3 mr-1' />
              Not Started
            </Button>
            <Button
              variant={currentStatus === "IN_PROGRESS" ? "default" : "outline"}
              size='sm'
              onClick={() => updateProgress("IN_PROGRESS")}
              disabled={isUpdating || currentStatus === "IN_PROGRESS"}
            >
              <Clock className='h-3 w-3 mr-1' />
              In Progress
            </Button>
            <Button
              variant={currentStatus === "MASTERED" ? "default" : "outline"}
              size='sm'
              onClick={() => updateProgress("MASTERED")}
              disabled={isUpdating || currentStatus === "MASTERED"}
            >
              <Check className='h-3 w-3 mr-1' />
              Mastered
            </Button>

            {/* Notes Toggle */}
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setShowNotes(!showNotes)}
            >
              {showNotes ? "Hide" : "Add"} Notes
            </Button>
          </div>

          {/* Notes Section */}
          {showNotes && (
            <div className='mt-3 space-y-2'>
              <label className='text-sm font-medium'>Instructor Notes</label>
              <textarea
                className='w-full p-2 text-sm border rounded-md bg-background'
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about student's progress..."
              />
            </div>
          )}

          {/* Existing Notes Display */}
          {progress?.instructorNotes && !showNotes && (
            <div className='mt-3 p-3 bg-muted/50 rounded-md'>
              <p className='text-xs font-medium text-muted-foreground mb-1'>
                Instructor Notes:
              </p>
              <p className='text-sm'>{progress.instructorNotes}</p>
            </div>
          )}

          {/* Completion Date */}
          {progress?.completedAt && (
            <p className='text-xs text-muted-foreground mt-2'>
              Mastered on {new Date(progress.completedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
