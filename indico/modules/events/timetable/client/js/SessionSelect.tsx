// This file is part of Indico.
// Copyright (C) 2002 - 2026 CERN
//
// Indico is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see the
// LICENSE file for more details.

import React from 'react';
import {Label} from 'semantic-ui-react';

import {FinalDropdown} from 'indico/react/forms';
import {Translate} from 'indico/react/i18n';

import {Session} from './types';

import './SessionSelect.module.scss';

interface SessionOption {
  key: string;
  text: string | React.ReactNode;
  value: number;
}

interface SessionSelectProps {
  sessions: Session[];
  [key: string]: unknown;
}

const processSessions = (sessions: Session[]) => {
  return sessions.length
    ? sessions.flatMap((session: Session): SessionOption[] => {
        const {colors} = session;
        return [
          {
            key: `session:${session.id}`,
            text: <Label style={colors}>{session.title}</Label>,
            value: session.id,
          },
        ];
      })
    : [];
};

export function SessionSelect({sessions, ...rest}: SessionSelectProps) {
  const sessionOptions = processSessions(sessions || []);
  const initialValue = sessionOptions[0]?.value;

  return (
    <FinalDropdown
      name="session_id"
      label={Translate.string('Session')}
      placeholder={
        sessionOptions.length
          ? Translate.string('Select a session')
          : Translate.string('No sessions available')
      }
      options={sessionOptions}
      selection
      search={false}
      multiple={false}
      initialValue={initialValue}
      nullIfEmpty
      disabled={!sessionOptions.length}
      {...rest}
    />
  );
}
