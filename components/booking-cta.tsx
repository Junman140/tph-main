"use client"

import { motion } from "framer-motion"
import { Button } from "./ui/button"

export default function BookingCTA() {
  return (
    <div className="bg-primary/10 rounded-lg p-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <h2 className="text-3xl font-bold mb-4">Ready to Join Our Community?</h2>
        <p className="text-muted-foreground mb-6">
          Take the first step towards spiritual growth and leadership development by booking your spot today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg">Book Now</Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

