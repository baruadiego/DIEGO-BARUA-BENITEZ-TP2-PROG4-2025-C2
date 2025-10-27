import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { type ObjectId } from "mongoose";

@Schema()
export class Person {
    @Prop({required: true, unique: true})
    dni: string;

    @Prop({required: true})
    name: string;

    @Prop({required: true})
    lastname: string;
}

export const PersonSchema = SchemaFactory.createForClass(Person);