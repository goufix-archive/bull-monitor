import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import shallow from 'zustand/shallow';
import CodeEditor from '@/components/CodeEditor';
import { useNetwork } from '@/hooks/use-network';
import { useAbstractMutation } from '@/hooks/use-abstract-mutation';
import { useCreateJobStore } from '@/stores/create-job';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import { activeQueueAtom } from '@/atoms/workspaces';
import { useAtomValue } from 'jotai/utils';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  label: {
    marginBottom: theme.spacing(1),
  },
  formControl: {
    marginBottom: theme.spacing(2),
  },
  appBar: {
    position: 'relative',
  },
  submitBtn: {
    marginLeft: theme.spacing(1),
  },
  form: {
    display: 'flex',
    padding: theme.spacing(2),
    paddingBottom: 0,
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      '& .CodeMirror': {
        height: 'calc(100vh - 180px)',
      },
    },
  },
}));

const FORM_ID = 'create-job_form';

const CreateJob = () => {
  const classes = useStyles();
  const queue = useAtomValue(activeQueueAtom) as string;
  const {
    mutations: { createJob },
  } = useNetwork();
  const {
    close,
    data,
    changeData,
    options,
    changeOptions,
    closeAndClearInput,
    name,
    changeName,
  } = useCreateJobStore();
  const mutation = useAbstractMutation({
    mutation: createJob,
    toast: 'Job has been created',
    onSuccess: closeAndClearInput,
    invalidateSharedQueries: true,
  });
  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    mutation.mutate({
      input: {
        queue,
        data,
        name,
        options,
      },
    });
  };
  return (
    <>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={close}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Button
            className={classes.submitBtn}
            disabled={mutation.isLoading}
            type="submit"
            form={FORM_ID}
            color="inherit"
          >
            Create job
          </Button>
        </Toolbar>
      </AppBar>
      <form className={classes.form} onSubmit={onSubmit} id={FORM_ID}>
        <TextField
          fullWidth
          variant="outlined"
          value={name}
          size="small"
          onChange={(e) => changeName(e.target.value)}
          id="create-job_name"
          label="Name"
          className={classes.formControl}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel className={classes.label}>Data</FormLabel>
              <CodeEditor value={data} onChange={changeData} />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel className={classes.label}>Options</FormLabel>
              <CodeEditor value={options} onChange={changeOptions} />
            </FormControl>
          </Grid>
        </Grid>
      </form>
    </>
  );
};
export default function CreateJobModal() {
  const [isOpen, onClose] = useCreateJobStore(
    (state) => [state.isOpen, state.close],
    shallow
  );
  return (
    <Dialog fullScreen open={isOpen} onClose={onClose}>
      <CreateJob />
    </Dialog>
  );
}
