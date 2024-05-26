Habit {
id: string;
user_id: string;
title: string;
color: string;
icon: string;
amount: number;
goal: number;
frequencyType: FrequencyType;
targets: Target[]
}

Target {
id: string;
user_id: string
habit_id: string;
date: string: // DD-MM-YYYY
amount: number;
}

// TODO; show a dialog when user completes a habit; This dialog should show the user that they can still use the habit

todays habits
[{
id: string;
title: string;
color: string;
icon: string;
progress: number; // Progress is a percentage of the completed targets of each habit compared to the total goal of the habit
}]

weekly habits
[{
date: string;
habits: [{
id: string;
title: string;
color: string;
icon: string;
progress: number; // Progress is a precentage delta for each day compared to the previous day
}]
}]

cheer chart
{
allHabitsCount: number;
completedHabitsCount: number;
}

weekly habit calendar
[{
id: string
title: string
color: string
icon: string
targets: [{
id: string;
date: string;
progress:
}]
}]
