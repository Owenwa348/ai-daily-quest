export function checkAchievements(level:number, totalExp:number) {

  const achievements:string[] = []

  if (level >= 2) achievements.push("First Level Up")
  if (totalExp >= 500) achievements.push("500 EXP Club")
  if (level >= 5) achievements.push("Rising Hero")

  return achievements
}
