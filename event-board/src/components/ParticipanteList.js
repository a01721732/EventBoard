"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

import EventCard from "./customized/card/event-card";

import DataTableDemo from "./customized/table/table-09";

const ParticipanteList = () => {
  return (
    <div className="">
        <DataTableDemo/>
    </div>
  );
};

export default ParticipanteList;
