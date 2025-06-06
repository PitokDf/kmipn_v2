'use client'

import { useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import TimelineItem from './TimelineItem';
import { useQuery } from '@tanstack/react-query';
import { getAllTimeline } from '@/lib/apis/timeline';
import { formatTanggal } from '@/lib/formatTanggal';
import LombaScheduleDialog from './TimelineInfo';

const TimelineSection = () => {
  const { data } = useQuery({
    queryKey: ['timelines'],
    queryFn: getAllTimeline
  })

  const timelineData = data?.map((timeline) => ({
    year: `${timeline.endTime ? `${formatTanggal(timeline.startTime)} - ${formatTanggal(timeline.endTime)}` : formatTanggal(timeline.startTime)}`,
    title: timeline.title,
    description: timeline.description,
    icon: null
  })) || []

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <section ref={containerRef} id="timeline" className="py-24 bg-gray-50 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Timeline
          </motion.h2>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="w-20 h-1 bg-orange-500 mx-auto rounded"
          ></motion.div>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gray-200">
            <motion.div
              className="absolute top-0 left-0 w-full bg-orange-600"
              style={{
                height: scrollYProgress,
                scaleY: scrollYProgress
              }}
            />
          </div>

          {/* Timeline Items */}
          <div className="relative">
            {timelineData.map((item, index) => (
              <TimelineItem
                key={item.year}
                data={item}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
      <LombaScheduleDialog />
    </section>
  );
};

export default TimelineSection;
