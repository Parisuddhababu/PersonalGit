export class CounterService {
  activeToInactiveCounter = 0;
  inactiveToActiveCounter = 0;

  incrementActiveToInactive() {
    this.activeToInactiveCounter++;
  }

  incrementInActiveToActive() {
    this.inactiveToActiveCounter++;
  }
}
