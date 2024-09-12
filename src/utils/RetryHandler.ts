class RetryHandler {
    private interval: number;
    private maxInterval: number;
  
    constructor() {
      this.interval = 1000; // Start at one second
      this.maxInterval = 60 * 1000; // Don't wait longer than a minute
    }
  
    /**
     * Invoke the function after waiting
     *
     * @param {() => void} fn Function to invoke
     */
    retry(fn: () => void): void {
      setTimeout(fn, this.interval);
      this.interval = this.nextInterval();
    }
  
    /**
     * Reset the counter (e.g. after successful request.)
     */
    reset(): void {
      this.interval = 1000;
    }
  
    /**
     * Calculate the next wait time.
     * @return {number} Next wait interval, in milliseconds
     *
     * @private
     */
    private nextInterval(): number {
      const interval = this.interval * 2 + this.getRandomInt(0, 1000);
      return Math.min(interval, this.maxInterval);
    }
  
    /**
     * Get a random int in the range of min to max. Used to add jitter to wait times.
     *
     * @param {number} min Lower bounds
     * @param {number} max Upper bounds
     * @private
     */
    private getRandomInt(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
};

export default RetryHandler;