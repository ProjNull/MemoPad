type NotificationDefinition = {
    type: "info" | "error" | "warn" | "success",
    msg: string
}



type NotificationProvider = {
    add: (d:NotificationDefinition) => void
}