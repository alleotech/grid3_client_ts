import { validate } from "class-validator";
import { plainToClass } from "class-transformer";

async function validateObject(obj) {
    const errors = await validate(obj);
    // errors is an array of validation errors
    if (errors.length > 0) {
        console.log("Validation failed. errors:", errors);
        throw Error(`Validation failed. errors: ${errors}`);
    } else {
        console.log("Validation succeed");
    }
}
// used as decorator
function validateInput(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    descriptor.value = async function (...args) {
        const types = Reflect.getMetadata("design:paramtypes", target, propertyKey);
        for (let i = 0; i < args.length; i++) {
            const input = plainToClass(types[i], args[i], { excludeExtraneousValues: true });
            await validateObject(input);
        }
        return await method.apply(this, args);
    };
}

export { validateObject, validateInput };
