import React, { useState } from 'react';
import Input from 'components/common/Input/Input';
import { useFormContext } from 'react-hook-form';
import ControlledSelect from 'components/common/Select/ControlledSelect';
import { METRICS_OPTIONS } from 'lib/constants';
import * as S from 'widgets/ClusterConfigForm/ClusterConfigForm.styled';
import SectionHeader from 'widgets/ClusterConfigForm/common/SectionHeader';
import SSLForm from 'widgets/ClusterConfigForm/common/SSLForm';
import Credentials from 'widgets/ClusterConfigForm/common/Credentials';

const Metrics = () => {
  const { setValue, watch } = useFormContext();
  const visibleMetrics = !!watch('metrics');
  const [configOpen, setConfigOpen] = useState(false);
  const toggleMetrics = () => {
    setConfigOpen((prevConfigOpen) => !prevConfigOpen);
    setValue(
      'metrics',
      visibleMetrics
        ? { isActive: false }
        : {
            isActive: true,
            type: '',
            port: 0,
            isAuth: false,
          },
      { shouldValidate: true, shouldDirty: true, shouldTouch: true }
    );
  };

  return (
    <>
      <SectionHeader
        title="Metrics"
        adding={!configOpen}
        addButtonText="Configure Metrics"
        onClick={toggleMetrics}
      />
      {configOpen && (
        <>
          <ControlledSelect
            name="metrics.type"
            label="Metrics Type"
            placeholder="Choose metrics type"
            options={METRICS_OPTIONS}
          />
          <S.Port>
            <Input
              label="Port *"
              name="metrics.port"
              type="number"
              positiveOnly
              withError
            />
          </S.Port>
          <Credentials prefix="metrics" />
          <SSLForm prefix="metrics.keystore" title="Metrics Keystore" />
        </>
      )}
    </>
  );
};
export default Metrics;
