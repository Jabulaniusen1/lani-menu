declare module 'paystack' {
  interface PaystackInstance {
    transaction: {
      initialize(data: any): Promise<any>
      verify(reference: string): Promise<any>
    }
    plan: {
      create(data: any): Promise<any>
    }
    subscription: {
      create(data: any): Promise<any>
      fetch(id: string): Promise<any>
      disable(data: any): Promise<any>
    }
  }

  function Paystack(secretKey: string): PaystackInstance
  export = Paystack
}
