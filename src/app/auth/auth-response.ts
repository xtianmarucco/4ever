export interface AuthResponse {

    user: {
        id: number,
        name: string,
        email: string,
        access_token: string,
        expires_in: number
    }
}
 // THIS WHAT i WILL REQUEST TO THE SERVER IN ORDER TO LOG IN IN THE APP 
 //This corresponds to the response that will be returned from the authentication serve