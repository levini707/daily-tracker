export const suggestedHabits = {
  'Health & Wellness': [
    { id: 'h_water', name: 'Drink water', icon: '💧', popular: true },
    { id: 'h_exercise', name: 'Exercise 30min', icon: '🏃', popular: true },
    { id: 'h_salad', name: 'Eat salad', icon: '🥗', popular: false },
    { id: 'h_sleep', name: 'Prioritize sleep', icon: '😴', popular: true },
    { id: 'h_meditate', name: 'Meditate', icon: '🧘', popular: true },
    { id: 'h_fresh_air', name: 'Breathe fresh air', icon: '🌬️', popular: false },
    { id: 'h_stairs', name: 'Use stairs', icon: '🪜', popular: false },
    { id: 'h_sunscreen', name: 'Wear sunscreen', icon: '🧴', popular: false },
    { id: 'h_green_tea', name: 'Drink green tea', icon: '🍵', popular: false },
    { id: 'h_less_meat', name: 'Eat less meat', icon: '🥬', popular: false }
  ],
  'Productivity': [
    { id: 'h_journal', name: 'Journal', icon: '📝', popular: true },
    { id: 'h_plan_day', name: 'Plan your day', icon: '📅', popular: true },
    { id: 'h_goals', name: 'Write down goals', icon: '🎯', popular: false },
    { id: 'h_screen_time', name: 'Limit screen time', icon: '📱', popular: false },
    { id: 'h_track_progress', name: 'Track progress', icon: '📊', popular: false },
    { id: 'h_learn', name: 'Learn something', icon: '📚', popular: false },
    { id: 'h_read', name: 'Read', icon: '📖', popular: true }
  ],
  'Social & Connection': [
    { id: 'h_family_dinner', name: 'Family dinner', icon: '🍽️', popular: false },
    { id: 'h_date_night', name: 'Date night', icon: '💑', popular: false },
    { id: 'h_kids_time', name: 'Quality time with kids', icon: '👨‍👩‍👧', popular: false },
    { id: 'h_playful', name: 'Be playful', icon: '🎈', popular: false },
    { id: 'h_volunteer', name: 'Volunteer', icon: '🤝', popular: false },
    { id: 'h_compliment', name: 'Compliment someone', icon: '💬', popular: true }
  ],
  'Personal Growth': [
    { id: 'h_gratitude', name: 'Practice gratitude', icon: '🙏', popular: true },
    { id: 'h_invest', name: 'Invest in future', icon: '💰', popular: false },
    { id: 'h_scary', name: 'Do something scary', icon: '🎢', popular: false },
    { id: 'h_fail', name: 'Fail & learn', icon: '💪', popular: false },
    { id: 'h_less_tv', name: 'Watch less TV', icon: '📺', popular: false },
    { id: 'h_reflect', name: 'Review & reflect', icon: '🤔', popular: true }
  ]
};

export const suggestedDayDetails = {
  'Weather': [
    { id: 'd_sunny', name: 'Sunny', icon: '☀️', popular: true },
    { id: 'd_rainy', name: 'Rainy', icon: '🌧️', popular: true },
    { id: 'd_cloudy', name: 'Cloudy', icon: '☁️', popular: true },
    { id: 'd_snowy', name: 'Snowy', icon: '❄️', popular: false },
    { id: 'd_windy', name: 'Windy', icon: '🌬️', popular: false },
    { id: 'd_foggy', name: 'Foggy', icon: '🌫️', popular: false }
  ],
  'Energy & Mood': [
    { id: 'd_high_energy', name: 'High energy', icon: '⚡', popular: true },
    { id: 'd_low_energy', name: 'Low energy', icon: '🔋', popular: false },
    { id: 'd_tired', name: 'Tired', icon: '😴', popular: false },
    { id: 'd_stressed', name: 'Stressed', icon: '😰', popular: true },
    { id: 'd_calm', name: 'Calm', icon: '😌', popular: false },
    { id: 'd_excited', name: 'Excited', icon: '🎉', popular: false }
  ],
  'Social': [
    { id: 'd_with_friends', name: 'With friends', icon: '👥', popular: false },
    { id: 'd_with_family', name: 'With family', icon: '👨‍👩‍👧', popular: false },
    { id: 'd_alone', name: 'Time alone', icon: '🏠', popular: false },
    { id: 'd_work_busy', name: 'Busy at work', icon: '🏢', popular: true },
    { id: 'd_social_event', name: 'Social event', icon: '🎭', popular: false }
  ],
  'Productivity': [
    { id: 'd_productive', name: 'Productive day', icon: '✅', popular: true },
    { id: 'd_followed_plan', name: 'Followed plan', icon: '📋', popular: false },
    { id: 'd_hit_goals', name: 'Hit goals', icon: '🎯', popular: false },
    { id: 'd_flow_state', name: 'Flow state', icon: '🚀', popular: false }
  ]
};

export const suggestedNightDetails = {
  'Sleep Quality': [
    { id: 'n_slept_well', name: 'Slept well', icon: '😴', popular: true },
    { id: 'n_okay_sleep', name: 'Okay sleep', icon: '😐', popular: true },
    { id: 'n_poor_sleep', name: 'Poor sleep', icon: '😵', popular: false },
    { id: 'n_fell_asleep_fast', name: 'Fell asleep fast', icon: '💤', popular: false },
    { id: 'n_trouble_sleeping', name: 'Trouble falling asleep', icon: '⏰', popular: true }
  ],
  'Dreams & Rest': [
    { id: 'n_had_dreams', name: 'Had dreams', icon: '💭', popular: false },
    { id: 'n_nightmares', name: 'Had nightmares', icon: '😱', popular: false },
    { id: 'n_woke_refreshed', name: 'Woke refreshed', icon: '🌅', popular: true },
    { id: 'n_woke_tired', name: 'Woke tired', icon: '😫', popular: false },
    { id: 'n_woke_early', name: 'Woke up early', icon: '⏰', popular: false }
  ],
  'Evening Routine': [
    { id: 'n_screen_bed', name: 'Screen before bed', icon: '📱', popular: true },
    { id: 'n_read_bed', name: 'Read before bed', icon: '📖', popular: false },
    { id: 'n_evening_routine', name: 'Evening routine', icon: '🧘', popular: false },
    { id: 'n_relaxed_evening', name: 'Relaxed evening', icon: '🌙', popular: false }
  ]
};